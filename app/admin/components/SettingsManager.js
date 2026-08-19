'use client';

import { useEffect, useState } from 'react';
import { apiRequest, jsonOptions } from './admin-client.js';

const emptySocial = { platform: '', label: '', url: '', sortOrder: 0, isActive: true };
const settingFields = [
  ['site_name', 'Website name'], ['logo_url', 'Company logo URL'], ['sales_email', 'Sales email'],
  ['sales_phone', 'Sales phone'], ['whatsapp_url', 'WhatsApp URL'], ['address', 'Address']
];

export function SettingsManager() {
  const [settings, setSettings] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialForm, setSocialForm] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [nextSettings, nextSocial] = await Promise.all([
        apiRequest('/api/admin/settings'), apiRequest('/api/admin/social-links')
      ]);
      setSettings(nextSettings); setSocialLinks(nextSocial);
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  function notify(text, type = 'success') { setMessage({ type, text }); window.setTimeout(() => setMessage(null), 3500); }

  async function saveSettings(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = Object.fromEntries(settingFields.map(([key]) => [key, form.get(key)]));
    const file = form.get('logo_file');
    try {
      if (file instanceof File && file.size) {
        const uploadForm = new FormData(); uploadForm.set('file', file);
        value.logo_url = (await apiRequest('/api/admin/uploads', { method: 'POST', body: uploadForm })).imageUrl;
      }
      setSettings(await apiRequest('/api/admin/settings', jsonOptions('PATCH', value)));
      notify('Website settings saved.');
    } catch (error) { notify(error.message, 'error'); }
  }

  async function saveSocial(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = { platform: form.get('platform'), label: form.get('label'), url: form.get('url'), sortOrder: Number(form.get('sortOrder') || 0), isActive: form.get('isActive') === 'on' };
    try {
      await apiRequest(socialForm.id ? `/api/admin/social-links/${socialForm.id}` : '/api/admin/social-links', jsonOptions(socialForm.id ? 'PATCH' : 'POST', value));
      setSocialForm(null); await load(); notify(socialForm.id ? 'Social link updated.' : 'Social link added.');
    } catch (error) { notify(error.message, 'error'); }
  }

  async function removeSocial(link) {
    if (!window.confirm(`Delete ${link.label}?`)) return;
    try { await apiRequest(`/api/admin/social-links/${link.id}`, { method: 'DELETE' }); await load(); notify('Social link deleted.'); }
    catch (error) { notify(error.message, 'error'); }
  }

  async function changePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('newPassword') !== form.get('passwordConfirmation')) { notify('New password and confirmation do not match.', 'error'); return; }
    try { await apiRequest('/api/admin/password', jsonOptions('POST', { currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword') })); event.currentTarget.reset(); notify('Administrator password changed.'); }
    catch (error) { notify(error.message, 'error'); }
  }

  if (loading) return <div className="admin-empty">Loading settings...</div>;
  return <div className="admin-stack"><div>{message ? <p className={`admin-feedback ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p> : null}</div>
    <section className="admin-section"><div className="section-heading"><div><h2>Website and contact</h2><p>These values are shared by the public header and contact areas.</p></div></div><form className="admin-form admin-form-panel" onSubmit={saveSettings}><div className="admin-form-grid">{settingFields.map(([key, label]) => <label key={key}>{label}<input name={key} defaultValue={settings[key] || ''} required={key !== 'logo_url'} /></label>)}<label>Upload or replace logo<input name="logo_file" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" /></label>{settings.logo_url ? <div><span className="form-label">Current logo</span><img className="admin-logo-preview" src={settings.logo_url} alt={settings.site_name || 'Company logo'} /></div> : null}</div><div className="admin-form-actions"><button className="admin-button primary" type="submit">Save website settings</button></div></form></section>
    <section className="admin-section"><div className="section-heading"><div><h2>Social links</h2><p>Publish only the channels currently used by your sales team.</p></div><button className="admin-button primary" type="button" onClick={() => setSocialForm({ ...emptySocial })}>Add social link</button></div>{socialForm ? <form className="admin-form admin-form-panel" onSubmit={saveSocial}><div className="admin-form-grid"><label>Platform<input name="platform" defaultValue={socialForm.platform} required /></label><label>Label<input name="label" defaultValue={socialForm.label} required /></label><label>URL<input name="url" type="url" defaultValue={socialForm.url} required /></label><label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={socialForm.sortOrder} /></label><label className="checkbox-label"><input name="isActive" type="checkbox" defaultChecked={socialForm.isActive} />Active</label></div><div className="admin-form-actions"><button className="admin-button secondary" type="button" onClick={() => setSocialForm(null)}>Cancel</button><button className="admin-button primary" type="submit">Save social link</button></div></form> : null}{socialLinks.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Platform</th><th>Label</th><th>URL</th><th>Status</th><th /></tr></thead><tbody>{socialLinks.map((link) => <tr key={link.id}><td className="row-title">{link.platform}</td><td>{link.label}</td><td><a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></td><td><span className={`status-label ${link.isActive ? '' : 'inactive'}`}>{link.isActive ? 'Active' : 'Hidden'}</span></td><td><div className="row-actions"><button type="button" onClick={() => setSocialForm(link)}>Edit</button><button className="danger" type="button" onClick={() => removeSocial(link)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty">No social links yet.</div>}</section>
    <section className="admin-section" id="password"><div className="section-heading"><div><h2>Administrator password</h2><p>Use at least 12 characters and keep the password private.</p></div></div><form className="admin-form admin-form-panel" onSubmit={changePassword}><div className="admin-form-grid"><label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required /></label><label>New password<input name="newPassword" type="password" minLength="12" autoComplete="new-password" required /></label><label>Password confirmation<input name="passwordConfirmation" type="password" minLength="12" autoComplete="new-password" required /></label></div><div className="admin-form-actions"><button className="admin-button primary" type="submit">Change password</button></div></form></section>
  </div>;
}
