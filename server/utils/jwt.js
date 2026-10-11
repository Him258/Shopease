const jwt = require('jsonwebtoken');

/**
 * Generates a signed JSON Web Token (JWT)
 * @param {string} id - The user ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
