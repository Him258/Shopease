import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Phone, MapPin, User } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ background: '#0f172a', color: '#cbd5e1', borderTop: '1px solid #1e293b', paddingTop: '3.5rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Trust Badges Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Fast Delivery</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Secure all-India dispatch</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Secure Payments</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>256-Bit Encrypted Gateways</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Easy Returns</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Hassle-free return policy</p>
            </div>
          </div>
        </div>

        {/* Footer 4-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Column 1: SHOP */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
              SHOP
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Home
                </Link>
              </li>
              <li>
                <a href="/#catalog" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  All Products
                </a>
              </li>
              <li>
                <a href="/#catalog" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Categories
                </a>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER SUPPORT */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
              CUSTOMER SUPPORT
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/contact" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: LEGAL */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
              LEGAL
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/terms" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" style={{ color: '#94a3b8', transition: 'var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = '#818cf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.5px' }}>
              CONTACT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={16} color="#818cf8" />
                <span style={{ color: 'white', fontWeight: 600 }}>Kishan Soni</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="#34d399" />
                <a href="tel:6267194039" style={{ color: '#818cf8', fontWeight: 600 }}>
                  6267194039
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: '1.5' }}>
                <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Vijay Nagar, Indore, Madhya Pradesh – 452001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Dynamic Copyright */}
        <div style={{ paddingTop: '1.75rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 700 }}>
            <ShoppingBag size={18} color="var(--primary)" />
            <span>ShopEase</span>
          </div>
          <p>© {currentYear} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
