const rateLimit = require('express-rate-limit');

const base = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
};

module.exports = {
  adminLoginLimiter: rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many admin login attempts, please try again later.' }
  }),

  studentLoginLimiter: rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many student login attempts, please try again later.' }
  }),

  postCreateLimiter: rateLimit({
    ...base,
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { error: 'Too many posts, please slow down.' }
  }),

  voteLimiter: rateLimit({
    ...base,
    windowMs: 5 * 60 * 1000,
    max: 60,
    message: { error: 'Too many votes, please slow down.' }
  })
};
