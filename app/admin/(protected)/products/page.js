import { CatalogManager } from '../../components/CatalogManager.js';

export const metadata = { title: 'Products | LP Flange Admin' };

export default function ProductsAdminPage() {
  return <div className="admin-page"><header className="admin-page-header"><div><h1>Products</h1><p>Manage catalog categories and products.</p></div></header><CatalogManager /></div>;
}
