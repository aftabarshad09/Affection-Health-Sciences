const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 Initializing email transporter...');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000
});

// verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email config error:', error.message);
  } else {
    console.log('✅ Email server ready');
  }
});

module.exports = transporter;