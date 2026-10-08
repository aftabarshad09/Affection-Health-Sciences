// Fails fast in production if a variable the app cannot function without is
// missing. The database is now a local SQLite file (no external DB service),
// so only email, image storage, and the admin login are required.
const REQUIRED_IN_PRODUCTION = [
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_USERNAME',
  'JWT_SECRET',
];

function validateEnv() {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    missing.push('ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH)');
  }
  if (missing.length === 0) return;

  if (process.env.NODE_ENV === 'production') {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.warn(`⚠️ Missing environment variables (dev mode, continuing): ${missing.join(', ')}`);
}

module.exports = { validateEnv };
