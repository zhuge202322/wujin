import { SettingsManager } from '../../components/SettingsManager.js';

export const metadata = { title: 'Settings | LP Flange Admin' };

export default function SettingsAdminPage() {
  return <div className="admin-page"><header className="admin-page-header"><div><h1>Settings</h1><p>Manage website identity, contacts, social links and access.</p></div></header><SettingsManager /></div>;
}
