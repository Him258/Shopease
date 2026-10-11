import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(
        err.response?.data?.message ||
          'Product not found or failed to load from server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  if (loading) {
    return <Loader text="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <ErrorMessage message={error || 'Product not found'} type="danger" />
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCartItem = items.find(
    (item) => item.product === product._id || item._id === product._id
  );

  return (
    <div className="container">
      <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <Link to="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>

      <div className="detail-container">
        <div className="detail-grid">
          {/* Image Column */}
          <div className="detail-image-box">
            <img
              src={product.image}
              alt={product.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Info Column */}
          <div className="detail-info">
            <div className="breadcrumb">
              <span>Products</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.category}</span>
            </div>

            <h1 className="detail-title">{product.title}</h1>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.5rem 0' }}>
              <span className="badge badge-neutral">{product.category}</span>
              {isOutOfStock ? (
                <span className="badge badge-failed">Out of Stock</span>
              ) : (
                <span className="badge badge-success">In Stock ({product.stock} units)</span>
              )}
            </div>

            <div className="detail-price-box">
              <span className="detail-price">
                <small style={{ fontSize: '1.4rem' }}>₹</small>
                {product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Inclusive of all taxes
              </span>
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Quantity Selector & Action Buttons */}
            {!isOutOfStock && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Quantity:
                </label>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Max: {product.stock}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`btn btn-lg ${
                  addedAnimation ? 'btn-secondary' : 'btn-primary'
                }`}
                style={{ flex: 1, minWidth: '200px' }}
              >
                {addedAnimation ? (
                  <>
                    <Check size={20} color="var(--success)" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                )}
              </button>
              <Link to="/cart" className="btn btn-secondary btn-lg">
                View Cart {inCartItem ? `(${inCartItem.qty})` : ''}
              </Link>
            </div>

            {/* Product Highlights */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                <Truck size={18} color="var(--primary)" />
                <span>Fast & insured shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span>Authentic guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
