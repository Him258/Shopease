import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  CreditCard,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/orders/my');
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load your order history. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="badge badge-paid">
            <CheckCircle2 size={13} /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="badge badge-pending">
            <Clock size={13} /> Pending
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="badge badge-failed">
            <XCircle size={13} /> Failed
          </span>
        );
    }
  };

  if (loading) {
    return <Loader text="Fetching your orders..." />;
  }

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track and view the details of all your previous purchases and payment transactions.
        </p>
      </div>

      <ErrorMessage message={error} type="danger" />

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Start exploring our store!</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span className="order-id">Order #{order._id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="order-date" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount</span>
                    <div className="order-total-amount">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Items in order */}
                <div className="order-items-grid">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-chip">
                      <img
                        src={
                          item.product?.image ||
                          'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer with Razorpay details */}
                <div className="order-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <CreditCard size={16} />
                    {order.razorpayPaymentId ? (
                      <span>
                        Payment ID: <code>{order.razorpayPaymentId}</code>
                      </span>
                    ) : (
                      <span>
                        Razorpay Order ID: <code>{order.razorpayOrderId || 'N/A'}</code>
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
