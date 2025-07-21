const fs = require('fs');
const jwt = require('jsonwebtoken');
const { generateOTP, getExpiry } = require('../utils/otpUtils');

const USERS_FILE = './data/users.json';
const OTPS_FILE = './data/otps.json';
const JWT_SECRET = 'secret123'; // Use env in real projects

// Helpers to read/write mock DB
const readData = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

exports.signup = (req, res) => {
  const { name, email, mobile, password } = req.body;
  const users = readData(USERS_FILE);

  const existingUser = users.find(u => u.email === email || u.mobile === mobile);
  if (existingUser) return res.status(400).json({ msg: 'User already exists' });

  const otp = generateOTP();
  const expiry = getExpiry();

  // Save user temporarily
  users.push({ name, email, mobile, password, verified: false });
  writeData(USERS_FILE, users);

  // Save OTP
  const otps = readData(OTPS_FILE);
  otps.push({ emailOrMobile: email || mobile, otp, expiry });
  writeData(OTPS_FILE, otps);

  res.json({ msg: 'Signup successful. Please verify OTP.', otp }); // send via email/SMS in real
};

exports.verifyOtp = (req, res) => {
  const { emailOrMobile, otp } = req.body;
  const otps = readData(OTPS_FILE);
  const users = readData(USERS_FILE);

  const found = otps.find(o => o.emailOrMobile === emailOrMobile && o.otp === otp);
  if (!found) return res.status(400).json({ msg: 'Invalid OTP' });

  if (Date.now() > found.expiry) return res.status(400).json({ msg: 'OTP expired' });

  const user = users.find(u => u.email === emailOrMobile || u.mobile === emailOrMobile);
  if (user) user.verified = true;

  writeData(USERS_FILE, users);

  // Remove OTP after use
  const updatedOtps = otps.filter(o => o.emailOrMobile !== emailOrMobile);
  writeData(OTPS_FILE, updatedOtps);

  res.json({ msg: 'OTP verified successfully!' });
};

exports.login = (req, res) => {
  const { emailOrMobile, password } = req.body;
  const users = readData(USERS_FILE);

  const user = users.find(u => (u.email === emailOrMobile || u.mobile === emailOrMobile) && u.password === password);
  if (!user) return res.status(401).json({ msg: 'Invalid credentials' });
  if (!user.verified) return res.status(403).json({ msg: 'Please verify your account with OTP first' });

  const accessToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', refreshToken, { httpOnly: true });
  res.json({ msg: 'Login successful', accessToken });
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'No token found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newAccessToken = jwt.sign({ email: decoded.email }, JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ msg: 'Invalid or expired refresh token' });
  }
};

exports.protectedRoute = (req, res) => {
  res.json({ msg: 'You accessed a protected route!', user: req.user });
};
