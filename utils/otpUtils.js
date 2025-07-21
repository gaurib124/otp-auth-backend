// utils/otpUtils.js
function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

function getExpiry(minutes = 5) {
  return Date.now() + minutes * 60 * 1000;
}

module.exports = { generateOTP, getExpiry };
