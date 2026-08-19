'use client';

import { useEffect, useState } from 'react';
import { apiRequest, jsonOptions } from './admin-client.js';

const emptyCategory = { name: '', slug: '', description: '', sortOrder: 0 };
const emptyProduct = { categoryId: '', name: '', slug: '', description: '', imageUrl: '', imageAlt: '', sortOrder: 0, isActive: true };

function Feedback({ message }) {
  return message ? <p className={`admin-feedback ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>{message.text}</p> : null;
}

export function CatalogManager() {
  const [tab, setTab] = useState('products');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryForm, setCategoryForm] = useState(null);
  const [productForm, setProductForm] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [nextCategories, nextProducts] = await Promise.all([
        apiRequest('/api/admin/categories'),
        apiRequest('/api/admin/products')
      ]);
      setCategories(nextCategories);
      setProducts(nextProducts);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function notify(text, type = 'success') {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  }

  async function saveCategory(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = { name: form.get('name'), slug: form.get('slug'), description: form.get('description'), sortOrder: Number(form.get('sortOrder') || 0) };
    try {
      await apiRequest(categoryForm.id ? `/api/admin/categories/${categoryForm.id}` : '/api/admin/categories', jsonOptions(categoryForm.id ? 'PATCH' : 'POST', value));
      setCategoryForm(null); await load(); notify(categoryForm.id ? 'Category updated.' : 'Category created.');
    } catch (error) { notify(error.message, 'error'); }
  }

  async function saveProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = {
      categoryId: form.get('categoryId') || null, name: form.get('name'), slug: form.get('slug'),
      description: form.get('description'), imageUrl: form.get('imageUrl'), imageAlt: form.get('imageAlt'),
      sortOrder: Number(form.get('sortOrder') || 0), isActive: form.get('isActive') === 'on'
    };
    try {
      await apiRequest(productForm.id ? `/api/admin/products/${productForm.id}` : '/api/admin/products', jsonOptions(productForm.id ? 'PATCH' : 'POST', value));
      setProductForm(null); await load(); notify(productForm.id ? 'Product updated.' : 'Product created.');
    } catch (error) { notify(error.message, 'error'); }
  }

  async function removeCategory(category) {
    if (!window.confirm(`Delete category “${category.name}”?`)) return;
    try { await apiRequest(`/api/admin/categories/${category.id}`, { method: 'DELETE' }); await load(); notify('Category deleted.'); }
    catch (error) { notify(error.message, 'error'); }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete product “${product.name}”?`)) return;
    try { await apiRequest(`/api/admin/products/${product.id}`, { method: 'DELETE' }); await load(); notify('Product deleted.'); }
    catch (error) { notify(error.message, 'error'); }
  }

  if (loading) return <div className="admin-empty">Loading catalog...</div>;
  return <div className="admin-stack">
    <div className="admin-tabs" role="tablist"><button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')} type="button">Products ({products.length})</button><button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')} type="button">Categories ({categories.length})</button></div>
    <Feedback message={message} />
    {tab === 'categories' ? <section className="admin-section"><div className="section-heading"><div><h2>Product categories</h2><p>Keep catalog navigation clear for buyers.</p></div><button className="admin-button primary" type="button" onClick={() => setCategoryForm({ ...emptyCategory })}>Add category</button></div>
      {categoryForm ? <form className="admin-form admin-form-panel" onSubmit={saveCategory}><div className="admin-form-grid"><label>Name<input name="name" defaultValue={categoryForm.name} required /></label><label>Slug<input name="slug" defaultValue={categoryForm.slug} required /><span className="field-help">Lowercase URL identifier.</span></label><label>Description<textarea name="description" defaultValue={categoryForm.description} /></label><label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={categoryForm.sortOrder} /></label></div><div className="admin-form-actions"><button className="admin-button secondary" type="button" onClick={() => setCategoryForm(null)}>Cancel</button><button className="admin-button primary" type="submit">Save category</button></div></form> : null}
      {categories.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Slug</th><th>Sort</th><th /></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td className="row-title">{category.name}<span className="row-subtitle">{category.description || 'No description'}</span></td><td>{category.slug}</td><td>{category.sortOrder}</td><td><div className="row-actions"><button type="button" onClick={() => setCategoryForm(category)}>Edit</button><button className="danger" type="button" onClick={() => removeCategory(category)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty">No categories yet.</div>}
    </section> : <section className="admin-section"><div className="section-heading"><div><h2>Products</h2><p>Manage products and their category assignments.</p></div><button className="admin-button primary" type="button" onClick={() => setProductForm({ ...emptyProduct })}>Add product</button></div>
      {productForm ? <form className="admin-form admin-form-panel" onSubmit={saveProduct}><div className="admin-form-grid"><label>Product name<input name="name" defaultValue={productForm.name} required /></label><label>Category<select name="categoryId" defaultValue={productForm.categoryId}>{<option value="">Unassigned</option>}{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Slug<input name="slug" defaultValue={productForm.slug} required /></label><label>Sort order<input name="sortOrder" type="number" min="0" defaultValue={productForm.sortOrder} /></label><label>Image URL<input name="imageUrl" defaultValue={productForm.imageUrl || ''} placeholder="/uploads/product.webp" /></label><label>Image alt text<input name="imageAlt" defaultValue={productForm.imageAlt || ''} /></label><label>Description<textarea name="description" defaultValue={productForm.description || ''} /></label><label className="checkbox-label"><input name="isActive" type="checkbox" defaultChecked={productForm.isActive} />Active on website</label></div><div className="admin-form-actions"><button className="admin-button secondary" type="button" onClick={() => setProductForm(null)}>Cancel</button><button className="admin-button primary" type="submit">Save product</button></div></form> : null}
      {products.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Sort</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td className="row-title">{product.name}<span className="row-subtitle">{product.slug}</span></td><td>{product.categoryName || 'Unassigned'}</td><td><span className={`status-label ${product.isActive ? '' : 'inactive'}`}>{product.isActive ? 'Active' : 'Hidden'}</span></td><td>{product.sortOrder}</td><td><div className="row-actions"><button type="button" onClick={() => setProductForm(product)}>Edit</button><button className="danger" type="button" onClick={() => removeProduct(product)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty">No products yet.</div>}
    </section>}
  </div>;
}
