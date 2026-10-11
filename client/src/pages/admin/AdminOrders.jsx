import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const FULFILLMENT_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, fulfillmentFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (fulfillmentFilter !== 'all') params.append('fulfillmentStatus', fulfillmentFilter);

      const response = await api.get(`/orders?${params.toString()}`);
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch order records.');
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillmentChange = async (orderId, newFulfillmentStatus) => {
    setUpdatingId(orderId);
    setError(null);
    setSuccessMsg(null);
    try {
      const { data } = await api.patch(`/orders/${orderId}/fulfillment`, {
        fulfillmentStatus: newFulfillmentStatus,
      });

      setSuccessMsg(data.message || 'Order status updated');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, fulfillmentStatus: newFulfillmentStatus } : o))
      );
    } catch (err) {
      console.error('Update fulfillment error:', err);
      setError(err.response?.data?.message || 'Failed to update fulfillment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const matchId = o._id.toLowerCase().includes(q);
    const matchName = o.user?.name?.toLowerCase().includes(q);
    const matchEmail = o.user?.email?.toLowerCase().includes(q);
    const matchPaymentId = (o.razorpayPaymentId || o.gatewayOrderId || '').toLowerCase().includes(q);
    return matchId || matchName || matchEmail || matchPaymentId;
  });

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="badge badge-paid">
            <CheckCircle2 size={12} /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="badge badge-pending">
            <Clock size={12} /> Pending
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="badge badge-failed">
            <XCircle size={12} /> Failed
          </span>
        );
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem' }}>Customer Orders & Fulfillment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage customer purchase records, view transaction IDs, and update fulfillment tracking.
        </p>
      </div>

      <ErrorMessage message={error} type="danger" />
      <ErrorMessage message={successMsg} type="success" />

      {/* Control Bar */}
      <div className="controls-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Order ID, customer name, email, or Payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Payment Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.6rem 0.8rem' }}
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.6rem 0.8rem' }}
          >
            <option value="all">All Fulfillment Statuses</option>
            {FULFILLMENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List View */}
      {loading ? (
        <Loader text="Loading customer orders..." />
      ) : filteredOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="order-card" style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span className="order-id" style={{ fontSize: '1.05rem' }}>Order #{order._id}</span>
                      {getPaymentBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Customer: <strong>{order.user?.name || 'Customer'}</strong> ({order.user?.email || 'N/A'})
                    </div>
                  </div>

                  {/* Fulfillment Status Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Truck size={16} />
                      <span style={{ fontWeight: 600 }}>Fulfillment:</span>
                    </div>
                    <select
                      value={order.fulfillmentStatus || 'Processing'}
                      onChange={(e) => handleFulfillmentChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="form-input"
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontWeight: 600,
                        width: 'auto',
                        borderColor:
                          order.fulfillmentStatus === 'Delivered'
                            ? 'var(--success)'
                            : order.fulfillmentStatus === 'Shipped'
                            ? 'var(--secondary)'
                            : order.fulfillmentStatus === 'Cancelled'
                            ? 'var(--danger)'
                            : 'var(--warning)',
                      }}
                    >
                      {FULFILLMENT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items in order */}
                <div className="order-items-grid" style={{ marginBottom: '1.25rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-chip">
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80'}
                        alt={item.title}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with Gateway & Amount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} />
                      <span>{dateStr}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CreditCard size={15} />
                      <span>
                        Gateway: <strong>{order.gateway || 'Cashfree'}</strong>
                        {order.razorpayPaymentId && (
                          <> | Payment ID: <code>{order.razorpayPaymentId}</code></>
                        )}
                        {order.gatewayOrderId && (
                          <> | Gateway ID: <code>{order.gatewayOrderId}</code></>
                        )}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span>Total Amount:</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3>No Orders Found</h3>
          <p>No orders match the selected search or status filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
