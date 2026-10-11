import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Filter,
  Eye,
  EyeOff,
  Save,
  X,
  Package,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const CATEGORIES = ['Shoes', 'T-Shirts', 'Accessories', 'Electronics', 'Home'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Shoes');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');
  const [isActive, setIsActive] = useState(true);

  // Quick Inline Stock Edit State
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockVal, setTempStockVal] = useState('');

  useEffect(() => {
    fetchAdminProducts();
  }, [categoryFilter, stockFilter, statusFilter]);

  const fetchAdminProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (stockFilter !== 'all') params.append('stockStatus', stockFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await api.get(`/products/admin/all?${params.toString()}`);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
      setError(err.response?.data?.message || 'Failed to load products list.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('Shoes');
    setImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
    setStock('20');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image);
    setStock(product.stock.toString());
    setIsActive(product.isActive !== false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      title,
      description,
      price: parseFloat(price),
      category,
      image,
      stock: parseInt(stock, 10),
      isActive,
    };

    try {
      if (modalMode === 'create') {
        await api.post('/products', payload);
        setSuccessMsg(`Product "${title}" created successfully!`);
      } else {
        await api.put(`/products/${selectedProduct._id}`, payload);
        setSuccessMsg(`Product "${title}" updated successfully!`);
      }
      closeModal();
      fetchAdminProducts();
    } catch (err) {
      console.error('Save product error:', err);
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to permanently delete "${productTitle}"?`)) {
      try {
        await api.delete(`/products/${productId}`);
        setSuccessMsg(`Product "${productTitle}" deleted successfully.`);
        fetchAdminProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const response = await api.patch(`/products/${productId}/status`);
      setSuccessMsg(response.data.message);
      fetchAdminProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle product status.');
    }
  };

  const handleSaveStock = async (productId) => {
    const numeric = parseInt(tempStockVal, 10);
    if (isNaN(numeric) || numeric < 0) {
      setError('Invalid stock value');
      return;
    }
    try {
      await api.patch(`/products/${productId}/stock`, { stock: numeric });
      setEditingStockId(null);
      fetchAdminProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem' }}>Product & Inventory Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Add new products, edit pricing, manage stock quantities, or toggle listings.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <ErrorMessage message={error} type="danger" />
      <ErrorMessage message={successMsg} type="success" />

      {/* Control Bar: Search & Filters */}
      <div className="controls-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.6rem 0.8rem' }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.6rem 0.8rem' }}
          >
            <option value="all">All Stock Statuses</option>
            <option value="in">In Stock (&gt; 5)</option>
            <option value="low">Low Stock (1 - 5)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Active/Inactive Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.6rem 0.8rem' }}
          >
            <option value="all">All Listings</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Products Table View */}
      {loading ? (
        <Loader text="Loading catalog..." />
      ) : filteredProducts.length > 0 ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock</th>
                <th style={{ padding: '1rem' }}>Listing Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isEditingThisStock = editingStockId === p._id;
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)', opacity: p.isActive === false ? 0.65 : 1 }}>
                    {/* Title & Thumbnail */}
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: '#f1f5f9' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {p._id}</div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    {/* Stock (with inline quick edit) */}
                    <td style={{ padding: '1rem' }}>
                      {isEditingThisStock ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="number"
                            min="0"
                            value={tempStockVal}
                            onChange={(e) => setTempStockVal(e.target.value)}
                            style={{ width: '70px', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--primary)' }}
                            autoFocus
                          />
                          <button onClick={() => handleSaveStock(p._id)} className="btn btn-primary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                            <Save size={14} />
                          </button>
                          <button onClick={() => setEditingStockId(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingStockId(p._id);
                            setTempStockVal(p.stock.toString());
                          }}
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          title="Click to quickly edit stock"
                        >
                          <span style={{ fontWeight: 600 }}>{p.stock} units</span>
                          {isOutOfStock ? (
                            <span className="badge badge-failed" style={{ fontSize: '0.7rem' }}>Out</span>
                          ) : isLowStock ? (
                            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Low</span>
                          ) : (
                            <span className="badge badge-paid" style={{ fontSize: '0.7rem' }}>In</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Active Status */}
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleToggleStatus(p._id)}
                        className={`badge ${p.isActive !== false ? 'badge-paid' : 'badge-failed'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle Active/Inactive"
                      >
                        {p.isActive !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {p.isActive !== false ? 'Active' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn btn-secondary btn-sm"
                          title="Edit product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="btn btn-danger btn-sm"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3>No products match your filter</h3>
          <p>Try changing your search terms or click "Add New Product" to create one.</p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '1.4rem' }}>
                {modalMode === 'create' ? 'Add New Store Product' : 'Edit Product Details'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Nike Air Max Pulse"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  rows="3"
                  required
                  placeholder="Describe the material, sizing, style..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    required
                    placeholder="e.g. 1999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Inventory Stock *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    required
                    placeholder="e.g. 25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Listing Visibility</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>
                      Visible in Store Catalog
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className="form-input"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.75rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="btn btn-primary">
                  {formLoading ? 'Saving...' : modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
