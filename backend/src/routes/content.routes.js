import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadContentImage } from '../middleware/upload.js';
import { logger } from '../utils/logger.js';
import {
  getAllContent,
  getSectionContent,
  updateSectionContent,
  handleContentImageUpload,
  deleteContentImage,
} from '../controllers/content.controller.js';

const router = Router();

// Enhanced multer error handler with better logging for content images
function handleMulterError(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        logger.error(`🔴 Multer content image error: ${err.message}`);
        logger.error(`🔴 Error code: ${err.code}`);
        
        // Add file info to request even if multer fails
        if (!req.file) req.file = null;
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Image file too large (max 5MB)' });
        }
        
        // For MIME type or other errors, continue
        logger.warn(`⚠️ Multer error but continuing: ${err.message}`);
      }
      
      logger.info(`🖼️ Multer content completed. req.file: ${req.file ? 'exists' : 'missing'}`);
      next();
    });
  };
}

// ── Public (read) ─────────────────────────────────────────────────────────
router.get('/', getAllContent);
router.get('/:section', getSectionContent);

// ── Admin only (write) ────────────────────────────────────────────────────
router.put('/:section', authenticate, requireAdmin, updateSectionContent);
router.post('/upload/image', authenticate, requireAdmin, handleMulterError(uploadContentImage.single('image')), handleContentImageUpload);
router.delete('/upload/image', authenticate, requireAdmin, deleteContentImage);

export default router;
