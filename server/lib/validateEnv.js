// Fails fast in production if a variable the app cannot function without is
// missing, instead of limping along and failing confusingly on first request.
// In development, missing vars only warn (individual modules already fall
// back to safe placeholders so `npm run dev` keeps working while you fill
// in .env incrementally).
const REQUIRED_IN_PRODUCTION = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

function validateEnv() {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  if (process.env.NODE_ENV === 'production') {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.warn(`⚠️ Missing environment variables (dev mode, continuing): ${missing.join(', ')}`);
}

module.exports = { validateEnv };
