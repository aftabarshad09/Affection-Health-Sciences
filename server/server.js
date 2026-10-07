const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const { validateEnv } = require('./lib/validateEnv');
validateEnv();

const emailRoutes = require('./routes/emailRoutes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const newsletterRoutes = require('./routes/newsletterRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const trackRoutes = require('./routes/trackRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  // The app serves its own frontend build from the same origin, so a
  // restrictive default CSP would need every existing inline style/script
  // audited first — cross-origin protections (frameguard, noSniff, HSTS,
  // etc.) are what matter most for an API server and are left at default.
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: ['https://www.affectionhealthsciences.com', 'https://affectionhealthsciences.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// API Routes
app.use('/api', emailRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/activity-logs', activityLogRoutes);

// CMS-uploaded images (products/blogs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running', timestamp: new Date() });
});

// Serve frontend from dist folder
const distPath = path.join(__dirname, '../dist');
console.log(`Checking for dist at: ${distPath}`);

if (fs.existsSync(distPath)) {
  console.log('✅ dist folder found, serving static files');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log('⚠️ dist folder not found - API only mode');
  app.get('/', (req, res) => {
    res.json({ message: 'Backend is running but frontend not built yet' });
  });
}

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API available at: /api/health`);
});