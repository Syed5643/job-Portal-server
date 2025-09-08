
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function areFieldsFilled(fields) {
  return Object.values(fields).every(value => value !== undefined && value !== null && value !== '');
}

module.exports = { isValidEmail, isValidPassword, areFieldsFilled };
