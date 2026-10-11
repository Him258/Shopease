import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut, Package, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <ShoppingBag size={20} />
          </div>
          <span>ShopEase</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Products
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Package size={17} />
              My Orders
            </NavLink>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'nav-link active admin-link' : 'nav-link admin-link')}
            >
              <Shield size={17} />
              Admin
            </NavLink>
          )}
        </nav>

        {/* Action Controls & User Menu */}
        <div className="nav-actions">
          {/* Cart Icon with Count */}
          <Link to="/cart" className="cart-btn-wrapper btn btn-secondary btn-sm" title="View Cart">
            <ShoppingCart size={18} />
            <span style={{ fontWeight: 600 }}>Cart</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-badge" title={user?.mobile ? `+91 ${user.mobile}` : user?.email || ''}>
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
