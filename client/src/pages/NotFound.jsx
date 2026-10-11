import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container">
      <div className="empty-state" style={{ marginTop: '4rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
