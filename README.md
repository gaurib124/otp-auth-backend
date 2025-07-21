OTP Auth Backend

This project is a backend API for handling user sign-up and OTP (One-Time Password) verification using Node.js, Express, and MongoDB.

It includes:
- Email-based user signup
- OTP generation and verification
- Email sending via Nodemailer
- Simple API for authentication flow

Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer (SMTP for sending OTPs)
- Thunder Client / Postman for API testing

Folder Structure

otp-auth-backend/
├── config/
│   └── db.js
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── .env
├── server.js
└── package.json

Setup Instructions

1. Clone the repository

git clone https://github.com/gaurib124/otp-auth-backend.git
cd otp-auth-backend

2. Install dependencies

npm install

3. Create .env file

PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password

4. Run the backend server

node server.js

Server will start at: http://localhost:5000

API Endpoints

Signup - POST /api/signup

Request Body:
{
  "email": "your_email@example.com"
}

Response:
{
  "msg": "Signup successful. Please verify OTP.",
  "otp": "123456"
}

Verify OTP - POST /api/verify-otp

Request Body:
{
  "email": "your_email@example.com",
  "otp": "123456"
}

Response:
{
  "msg": "OTP verified successfully"
}

Testing the API

You can test the endpoints using:
- Thunder Client (VS Code Extension)
- Postman

Notes

- OTP is printed in the API response and also sent to email (for testing).
- OTP expires after a set time (you can add expiration logic).
- You can expand the project to include JWT login, resend OTP, or phone number support.

Author

Gauri D. Bhagyawant
GitHub: https://github.com/gaurib124
Email: gauribhagyawant@gmail.com

Give a Star

If you found this useful, consider giving a star on the GitHub repo:
https://github.com/gaurib124/otp-auth-backend
