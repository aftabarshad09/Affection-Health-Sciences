const express = require('express');
const router = express.Router();
const transporter = require('../config/emailConfig');

let subscribers = [];

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email address" });
  }
  
  if (subscribers.includes(email)) {
    return res.status(400).json({ success: false, error: "Email already subscribed" });
  }
  
  subscribers.push(email);
  
  try {
    await transporter.sendMail({
      from: `"Affection Health Sciences Newsletter" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "📧 New Newsletter Subscriber",
      html: `<h2>New Subscriber!</h2><p>Email: ${email}</p><p>Total: ${subscribers.length}</p>`
    });
    
    await transporter.sendMail({
      from: `"Affection Health Sciences Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Newsletter! 🎉",
      html: `<h2>Welcome!</h2><p>Thank you for subscribing to the Affection Health Sciences newsletter.</p>`
    });
    
    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Newsletter error:", err.message);
    res.status(500).json({ success: false, error: "Failed to subscribe. Please try again." });
  }
});

router.get('/count', (req, res) => {
  res.json({ count: subscribers.length });
});

module.exports = router;