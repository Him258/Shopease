import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, items } = useCart();

  const isOutOfStock = product.stock <= 0;
  const inCartItem = items.find(
    (item) => item.product === product._id || item._id === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-img-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="product-category-tag">{product.category}</span>
        {isOutOfStock ? (
          <span className="badge badge-failed stock-pill">Out of Stock</span>
        ) : product.stock < 5 ? (
          <span className="badge badge-warning stock-pill">Low Stock: {product.stock}</span>
        ) : null}
      </Link>

      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-title" title={product.title}>
            {product.title}
          </h3>
        </Link>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            <small>₹</small>
            {product.price.toLocaleString('en-IN')}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm ${
              inCartItem ? 'btn-secondary' : 'btn-primary'
            }`}
            title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
          >
            {inCartItem ? (
              <>
                <Check size={16} style={{ color: 'var(--success)' }} />
                Added ({inCartItem.qty})
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
