import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Users,
  Calendar,
  ShoppingBag,
  CreditCard,
  Mail,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/customers');
      setCustomers(response.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err.response?.data?.message || 'Failed to fetch customer directory.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem' }}>Customer Directory</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          View registered customer accounts, purchase frequencies, and lifetime spending.
        </p>
      </div>

      <ErrorMessage message={error} type="danger" />

      {/* Search Box */}
      <div className="controls-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search customer by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Loading customer accounts..." />
      ) : filtered.length > 0 ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Customer Name</th>
                <th style={{ padding: '1rem' }}>Email Address</th>
                <th style={{ padding: '1rem' }}>Joined Date</th>
                <th style={{ padding: '1rem' }}>Total Orders</th>
                <th style={{ padding: '1rem' }}>Paid Orders</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Lifetime Spend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="user-avatar" style={{ width: '34px', height: '34px' }}>
                      {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                  </td>

                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {c.totalOrders}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-paid">
                      {c.paidOrders} Completed
                    </span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Users className="empty-state-icon" />
          <h3>No customers found</h3>
          <p>No customer matches your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
