const rateLimit = require('express-rate-limit');

// Configure the rate limiting middleware
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  headers: true, // Include rate limit headers in responses
});

module.exports = apiRateLimiter;
