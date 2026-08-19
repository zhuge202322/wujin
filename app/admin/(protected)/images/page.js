import { ImageManager } from '../../components/ImageManager.js';

export const metadata = { title: 'Images | LP Flange Admin' };

export default function ImagesAdminPage() {
  return <div className="admin-page"><header className="admin-page-header"><div><h1>Images</h1><p>Replace page and section imagery without changing layout code.</p></div></header><ImageManager /></div>;
}
