import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

// Apply general rate limit to all requests
export const globalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs || 15 * 60 * 1000, // 15 minutes by default
  max: env.rateLimitMaxRequests || 200, // 200 requests per window by default
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limit for authentication routes (login, register, OTP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for payment routes
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: {
    message: 'Too many payment requests, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
