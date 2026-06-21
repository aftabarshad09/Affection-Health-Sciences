const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const emailRoutes = require('./routes/emailRoutes');
const errorHandler = require('./middleware/errorHandler');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://www.affectionhealthsciences.com', 'https://affectionhealthsciences.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', emailRoutes);
app.use('/api/newsletter', newsletterRoutes);

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