'use client';

import { useEffect, useState } from 'react';
import { apiRequest, jsonOptions } from './admin-client.js';

const emptyImage = { pageKey: '', sectionKey: '', imageUrl: '', altText: '', sortOrder: 0 };

export function ImageManager() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setImages(await apiRequest('/api/admin/images')); }
    catch (error) { setMessage({ type: 'error', text: error.message }); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function notify(text, type = 'success') {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  }

  function startEdit(image) {
    setForm(image ? { ...image, file: null } : { ...emptyImage, file: null });
    setPreview(image?.imageUrl || '');
  }

  async function save(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let imageUrl = form.imageUrl;
    try {
      const file = formData.get('file');
      if (file instanceof File && file.size) {
        const uploadData = new FormData();
        uploadData.set('file', file);
        const uploaded = await apiRequest('/api/admin/uploads', { method: 'POST', body: uploadData });
        imageUrl = uploaded.imageUrl;
      }
      await apiRequest(form.id ? `/api/admin/images/${form.id}` : '/api/admin/images', jsonOptions(form.id ? 'PATCH' : 'POST', {
        pageKey: formData.get('pageKey'), sectionKey: formData.get('sectionKey'), imageUrl,
        altText: formData.get('altText'), sortOrder: Number(formData.get('sortOrder') || 0)
      }));
      setForm(null); setPreview(''); await load(); notify(form.id ? 'Image updated.' : 'Image added.');
    } catch (error) { notify(error.message, 'error'); }
  }

  async function remove(image) {
    if (!window.confirm(`Delete the ${image.pageKey}/${image.sectionKey} image?`)) return;
    try { await apiRequest(`/api/admin/images/${image.id}`, { method: 'DELETE' }); await load(); notify('Image deleted.'); }
    catch (error) { notify(error.message, 'error'); }
  }

  if (loading) return <div className="admin-empty">Loading image library...</div>;
  return <div className="admin-stack"><div className="section-heading admin-section"><div><h2>Page images</h2><p>Every image record has a stable page key, section key, and accessible alt text.</p></div><button className="admin-button primary" type="button" onClick={() => startEdit(null)}>Add image</button></div><div>{message ? <p className={`admin-feedback ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p> : null}</div>
    {form ? <section className="admin-section"><form className="admin-form admin-form-panel" onSubmit={save}><div className="admin-form-grid"><label>Page key<input name="pageKey" defaultValue={form.pageKey} placeholder="home" required /></label><label>Section key<input name="sectionKey" defaultValue={form.sectionKey} placeholder="hero-slide-1" required /></label><label>Alt text<input name="altText" defaultValue={form.altText} required /></label><label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={form.sortOrder} /></label><label>Upload or replace image<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPreview(URL.createObjectURL(file)); } }} /></label>{preview ? <div><span className="form-label">Preview</span><img className="upload-preview" src={preview} alt="Selected image preview" /></div> : null}</div><div className="admin-form-actions"><button className="admin-button secondary" type="button" onClick={() => { setForm(null); setPreview(''); }}>Cancel</button><button className="admin-button primary" type="submit">Save image</button></div></form></section> : null}
    <section className="admin-section">{images.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Preview</th><th>Page / section</th><th>Alt text</th><th>Sort</th><th /></tr></thead><tbody>{images.map((image) => <tr key={image.id}><td><img className="admin-thumbnail" src={image.imageUrl} alt={image.altText} /></td><td className="row-title">{image.pageKey}<span className="row-subtitle">{image.sectionKey}</span></td><td>{image.altText}</td><td>{image.sortOrder}</td><td><div className="row-actions"><button type="button" onClick={() => startEdit(image)}>Edit</button><button className="danger" type="button" onClick={() => remove(image)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty">No managed images yet.</div>}</section>
  </div>;
}
