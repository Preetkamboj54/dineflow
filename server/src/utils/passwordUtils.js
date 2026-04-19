const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt
 * @param {string} password - Plaintext password to hash
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password with a hashed password
 * @param {string} password - Plaintext password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
