// utils/validate.js

// Check if email format is valid
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if password is at least 6 characters
function isValidPassword(password) {
  return password && password.length >= 6;
}

// Check if all required fields are filled
function areFieldsFilled(fields) {
  return Object.values(fields).every(value => value !== undefined && value !== null && value !== '');
}

module.exports = { isValidEmail, isValidPassword, areFieldsFilled };
