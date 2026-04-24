import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createIntent } from '../controllers/payments.controller.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/intent', paymentLimiter, asyncHandler(createIntent));

export default router;