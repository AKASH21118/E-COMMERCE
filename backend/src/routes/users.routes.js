import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getProfile, login, register, updateProfile,
  getAdminMobile, registerAdminMobile, updateAdminMobile,
  requestAdminOtp, changeAdminPassword,
  googleAuth,
} from '../controllers/users.controller.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
// Google OAuth sign-in / sign-up (no auth middleware – this IS the auth step)
router.post('/google', asyncHandler(googleAuth));
router.get('/me', authenticate, asyncHandler(getProfile));
router.put('/me', authenticate, asyncHandler(updateProfile));

// Admin settings routes
router.get('/admin/mobile', authenticate, requireAdmin, asyncHandler(getAdminMobile));
router.post('/admin/mobile', authenticate, requireAdmin, asyncHandler(registerAdminMobile));
router.put('/admin/mobile', authenticate, requireAdmin, asyncHandler(updateAdminMobile));
router.post('/admin/request-otp', authenticate, requireAdmin, asyncHandler(requestAdminOtp));
router.post('/admin/change-password', authenticate, requireAdmin, asyncHandler(changeAdminPassword));

export default router;