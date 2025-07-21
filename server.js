const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// 👇 Add this welcome route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to OTP Auth API! Available routes: /api/signup, /api/login, etc.');
});

// Main API routes
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
