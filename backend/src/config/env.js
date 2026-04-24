import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * SECURITY: Validate and load all required environment variables
 * Crash immediately if critical secrets are missing in production
 */
const env = {
  // Server
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS & Security
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // Database (CRITICAL)
  databaseUrl: process.env.DATABASE_URL,

  // JWT (CRITICAL)
  jwtSecret: process.env.JWT_SECRET,

  // Payment: Razorpay (CRITICAL for production)
  paymentProvider: process.env.PAYMENT_PROVIDER || 'demo',
  paymentCurrency: process.env.PAYMENT_CURRENCY || 'INR',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',

  // SMS (Optional)
  fast2smsApiKey: process.env.FAST2SMS_API_KEY || '',
  smsProvider: process.env.SMS_PROVIDER || '',

  // Cloudinary (For image/video uploads)
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',

  // Security: Rate limiting
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 min
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // 100 requests per window
};

/**
 * PRODUCTION SAFETY: Validate critical environment variables
 * These MUST be set in production or the server will not start
 */
function validateEnvironment() {
  const errors = [];

  // Database URL is always required
  if (!env.databaseUrl) {
    errors.push('DATABASE_URL is required');
  }

  // JWT secret is always required
  if (!env.jwtSecret) {
    errors.push('JWT_SECRET is required');
  }

  // In production, validate additional critical variables
  if (!isDevelopment) {
    if (!env.clientOrigin) {
      errors.push('CLIENT_ORIGIN is required in production');
    }
    
    // If payment provider is razorpay, keys are required
    if (env.paymentProvider === 'razorpay') {
      if (!env.razorpayKeyId) {
        errors.push('RAZORPAY_KEY_ID is required when PAYMENT_PROVIDER=razorpay');
      }
      if (!env.razorpayKeySecret) {
        errors.push('RAZORPAY_KEY_SECRET is required when PAYMENT_PROVIDER=razorpay');
      }
    }

    // Cloudinary is recommended for production
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      console.warn('⚠️  SECURITY WARNING: Cloudinary not configured. Image uploads may not persist on production.');
    }
  }

  if (errors.length > 0) {
    console.error('❌ ENVIRONMENT VALIDATION FAILED:');
    errors.forEach(err => console.error(`   - ${err}`));
    console.error('\nPlease set all required environment variables before starting the server.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}

// Validate immediately on import
validateEnvironment();

export default env;