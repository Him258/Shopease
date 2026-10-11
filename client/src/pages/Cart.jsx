import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ErrorMessage from '../components/ErrorMessage';

// Load Cashfree JS SDK v3 dynamically
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { items, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleCheckout = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (items.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Request Payment Order from Backend
      const payload = {
        items: items.map((item) => ({
          productId: item.product || item._id,
          qty: item.qty,
        })),
        gateway: 'cashfree',
      };

      const { data: orderData } = await api.post('/payment/create-order', payload);

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order.');
      }

      // 2. Handle Cashfree Checkout
      if (orderData.gateway === 'cashfree' && orderData.paymentSessionId) {
        const isLoaded = await loadCashfreeScript();
        if (!isLoaded || !window.Cashfree) {
          throw new Error('Failed to load Cashfree Payment SDK. Check your internet connection.');
        }

        const cashfree = window.Cashfree({
          mode: 'sandbox',
        });

        cashfree
          .checkout({
            paymentSessionId: orderData.paymentSessionId,
            redirectTarget: '_modal',
          })
          .then(async (result) => {
            if (result.error) {
              console.warn('Cashfree payment error/closed:', result.error);
              setError(result.error.message || 'Payment cancelled or dismissed.');
              setProcessing(false);
              return;
            }

            // Verify with backend
            try {
              const { data: verifyData } = await api.post('/payment/verify', {
                order_id: orderData.orderId,
              });

              if (verifyData.success) {
                clearCart();
                setSuccessMsg('🎉 Payment Successful! Your order has been placed.');
                setTimeout(() => {
                  navigate('/orders');
                }, 1200);
              } else {
                setError(verifyData.message || 'Payment verification pending/failed.');
                setProcessing(false);
              }
            } catch (verifyErr) {
              console.error('Verification error:', verifyErr);
              // Check if payment was captured anyway
              navigate('/orders');
            }
          })
          .catch((sdkErr) => {
            console.error('Cashfree SDK error:', sdkErr);
            setError('Payment popup error. Please try again.');
            setProcessing(false);
          });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong while initiating payment.'
      );
      setProcessing(false);
    }
  };

  if (items.length === 0 && !successMsg) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <ShoppingBag className="empty-state-icon" />
          <h3>Your shopping cart is empty</h3>
          <p>Looks like you haven't added any premium gear to your cart yet.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Review your items and complete your order with secure checkout.
      </p>

      <ErrorMessage message={error} type="danger" />
      <ErrorMessage message={successMsg} type="success" />

      <div className="cart-layout">
        {/* Cart Item List */}
        <div className="cart-card">
          <div className="cart-header">
            <h3 style={{ fontSize: '1.15rem' }}>Cart Items</h3>
            <button
              onClick={clearCart}
              className="btn btn-danger btn-sm"
              disabled={processing}
            >
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {items.map((item) => {
              const itemTotal = (item.price * item.qty).toLocaleString('en-IN');
              const productId = item.product || item._id;

              return (
                <div key={productId} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=300&q=80';
                    }}
                  />

                  <div className="cart-item-info">
                    <Link to={`/products/${productId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <span className="cart-item-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="qty-control" style={{ marginBottom: 0 }}>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(productId, item.qty - 1)}
                      disabled={processing || item.qty <= 1}
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(productId, item.qty + 1)}
                      disabled={processing || (item.stock && item.qty >= item.stock)}
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="cart-item-total">₹{itemTotal}</span>
                    <button
                      onClick={() => removeFromCart(productId)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      title="Remove item"
                      disabled={processing}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box */}
        <div>
          <div className="summary-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row">
              <span>GST / Taxes</span>
              <span>Included</span>
            </div>

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleCheckout}
                disabled={processing || items.length === 0}
                className="btn btn-primary btn-block btn-lg"
              >
                {processing ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: '20px', height: '20px', borderWidth: '2px' }}
                    ></div>
                    Connecting Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Proceed to Pay (₹{total.toLocaleString('en-IN')})
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            <div className="payment-note">
              <Lock size={15} />
              <span>Cashfree 256-bit Encrypted Checkout</span>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>UPI, Cards, NetBanking, & Wallets supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
