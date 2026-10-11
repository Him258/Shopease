import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const ErrorMessage = ({ message, type = 'danger' }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <Info size={18} />;
      case 'danger':
      default:
        return <AlertCircle size={18} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
