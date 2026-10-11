import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/stats');
      setData(response.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading Admin Dashboard..." />;
  }

  const { stats, recentOrders } = data || {};

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-paid">Admin Area</span>
            <h1 style={{ fontSize: '2.2rem' }}>Dashboard Overview</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time business performance, revenue, orders, and inventory metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-primary">
            <PlusCircle size={18} /> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            <Package size={18} /> View All Orders
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} type="danger" />

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Total Revenue */}
        <div className="admin-stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Total Revenue (Paid)</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
            <TrendingUp size={14} /> Verified Gateway Payments
          </span>
        </div>

        {/* Total Orders */}
        <div className="admin-stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Total Orders</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {stats?.totalOrders || 0}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
            {stats?.processingFulfillmentCount || 0} fulfillment pending
          </span>
        </div>

        {/* Active Products */}
        <div className="admin-stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Products in Catalog</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-subtle)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {stats?.totalProducts || 0}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
            {stats?.activeProducts || 0} active on store
          </span>
        </div>

        {/* Registered Customers */}
        <div className="admin-stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Customers</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {stats?.totalCustomers || 0}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
            Registered buyer accounts
          </span>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {(stats?.lowStockProducts > 0 || stats?.outOfStockProducts > 0) && (
        <div style={{ background: 'var(--warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400e' }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Inventory Warning:</strong> {stats?.outOfStockProducts || 0} products out of stock, {stats?.lowStockProducts || 0} products low in stock.
            </div>
          </div>
          <Link to="/admin/products?stock=low" className="btn btn-secondary btn-sm" style={{ background: 'white' }}>
            Restock Inventory
          </Link>
        </div>
      )}

      {/* Navigation Quick Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Link to="/admin/products" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition-fast)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Product Management</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add, edit, delete, restock, or deactivate items</p>
          </div>
          <ArrowRight size={20} color="var(--primary)" />
        </Link>

        <Link to="/admin/orders" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition-fast)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Order Management</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track fulfillment, shipping status & payments</p>
          </div>
          <ArrowRight size={20} color="var(--primary)" />
        </Link>

        <Link to="/admin/customers" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition-fast)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Customer Directory</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>View customer purchases, spend & join dates</p>
          </div>
          <ArrowRight size={20} color="var(--primary)" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '1.75rem', marginBottom: '3rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Recent Store Orders</h3>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            View All ({stats?.totalOrders || 0})
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Items</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Fulfillment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>
                      #{o._id.slice(-6)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{o.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      {o.items?.length} {o.items?.length === 1 ? 'item' : 'items'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                      ₹{o.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${o.status === 'paid' ? 'badge-paid' : o.status === 'pending' ? 'badge-pending' : 'badge-failed'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className="badge badge-neutral">
                        {o.fulfillmentStatus || 'Processing'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No orders placed yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
