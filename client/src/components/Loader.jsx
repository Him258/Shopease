import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500 }}>{text}</p>
    </div>
  );
};

export default Loader;
