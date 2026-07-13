const db = require('../lib/db');
const transporter = require('../config/emailConfig');

exports.list = async (req, res) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.featured === 'true') filter.featured = true;
    const reviews = await db.reviews.list(filter);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.adminList = async (req, res) => {
  try {
    const reviews = await db.reviews.list();
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, email, product, rating, text } = req.body;

  if (!name || !email || !rating || !text) {
    return res.status(400).json({ success: false, error: 'Name, rating and review text are required' });
  }

  try {
    const review = await db.reviews.create({
      name,
      email,
      location: '',
      product: product || '',
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verified: false,
      helpful: 0,
      title: '',
      text,
      status: 'pending',
      featured: false,
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: `New Review Submitted by ${name}`,
        html: `
          <h2>New Review Awaiting Approval</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Product:</b> ${product || 'N/A'}</p>
          <p><b>Rating:</b> ${rating}/5</p>
          <p><b>Review:</b></p>
          <p>${text}</p>
          <p>Log into the admin panel to approve or reject this review.</p>
        `,
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thanks for your review',
        html: `
          <h3>Hi ${name},</h3>
          <p>Thank you for taking the time to share your experience with us. We really appreciate it!</p>
        `,
      });
    } catch (mailErr) {
      console.error('❌ Review notification email failed:', mailErr);
    }

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await db.reviews.update(Number(req.params.id), req.body);
    res.json({ success: true, review: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.reviews.remove(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
