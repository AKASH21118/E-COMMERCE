import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadCarouselImage, uploadCarouselVideo } from '../middleware/upload.js';
import { logger } from '../utils/logger.js';
import {
  listCarouselItems,
  addProductToCarousel,
  addImageToCarousel,
  addVideoToCarousel,
  updateCarouselItem,
  deleteCarouselItem,
  reorderCarousel,
} from '../controllers/carousel.controller.js';

const router = Router();

// Enhanced multer error handler for carousel uploads
function handleMulterError(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        logger.error(`🔴 Multer carousel error: ${err.message}`);
        logger.error(`🔴 Error code: ${err.code}`);
        
        // Add file info to request even if multer fails
        if (!req.file) req.file = null;
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large (max 5MB for images, 200MB for videos)' });
        }
        
        // For MIME type or other errors, continue
        logger.warn(`⚠️ Multer error but continuing: ${err.message}`);
      }
      
      logger.info(`🎠 Multer carousel completed. req.file: ${req.file ? 'exists' : 'missing'}`);
      next();
    });
  };
}

// Public
router.get('/', asyncHandler(listCarouselItems));

// Admin
router.post('/product', authenticate, requireAdmin, asyncHandler(addProductToCarousel));
router.post('/image', authenticate, requireAdmin, handleMulterError(uploadCarouselImage.single('image')), asyncHandler(addImageToCarousel));
router.post('/video', authenticate, requireAdmin, handleMulterError(uploadCarouselVideo.single('video')), asyncHandler(addVideoToCarousel));
router.put('/:id', authenticate, requireAdmin, asyncHandler(updateCarouselItem));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(deleteCarouselItem));
router.post('/reorder', authenticate, requireAdmin, asyncHandler(reorderCarousel));

export default router;
