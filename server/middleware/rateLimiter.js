const rateLimit = require('express-rate-limit');

// Generous general-purpose limiter for the whole API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please try again later' },
});

// Tight limiter for auth endpoints (login/register/password reset) to slow
// down credential-stuffing / brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts — please try again later' },
});

module.exports = { apiLimiter, authLimiter };
