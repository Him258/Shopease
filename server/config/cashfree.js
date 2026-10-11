const axios = require('axios');

const getCashfreeHeaders = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey || appId.trim() === '' || secretKey.trim() === '') {
    const error = new Error(
      'Cashfree API Keys are missing. Please configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY in server/.env'
    );
    error.statusCode = 500;
    throw error;
  }

  return {
    'x-client-id': appId.trim(),
    'x-client-secret': secretKey.trim(),
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json',
  };
};

const getCashfreeBaseUrl = () => {
  const env = process.env.CASHFREE_ENV || 'sandbox';
  return env === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
};

const cashfreeClient = {
  createOrder: async (orderPayload) => {
    const url = `${getCashfreeBaseUrl()}/orders`;
    const headers = getCashfreeHeaders();
    const response = await axios.post(url, orderPayload, { headers });
    return response.data;
  },

  getOrder: async (orderId) => {
    const url = `${getCashfreeBaseUrl()}/orders/${orderId}`;
    const headers = getCashfreeHeaders();
    const response = await axios.get(url, { headers });
    return response.data;
  },
};

module.exports = {
  cashfreeClient,
  getCashfreeHeaders,
  getCashfreeBaseUrl,
};
