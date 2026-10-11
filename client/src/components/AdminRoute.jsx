import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader text="Verifying administrator permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <div className="empty-state">
          <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>403 - Access Forbidden</h2>
          <p>You do not have administrative privileges to access this area.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
