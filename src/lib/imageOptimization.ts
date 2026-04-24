/**
 * Utility functions for optimizing Cloudinary image URLs.
 * Reduces image payload size while maintaining visual quality.
 */

/**
 * Generate optimized Cloudinary image URL.
 * @param {string} url - Cloudinary URL or local image path
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return '';

  // Skip non-Cloudinary URLs (local images, etc.)
  if (!url.includes('cloudinary')) {
    return url;
  }

  const {
    width = 400,      // Default width for product cards
    quality = 'auto', // Auto quality for best compression
    format = 'auto',  // Auto format (WebP if supported)
    crop = 'fill',    // Crop strategy
    gravity = 'auto', // Smart cropping
  } = options;

  try {
    // For Cloudinary URLs, inject transformation parameters
    // Format: https://res.cloudinary.com/{cloud}/{resource_type}/{type}/{id}/v{version}/{transformations}/{public_id}
    
    // Find the position to insert transformations (after /v{version}/)
    const cloudinaryMatch = url.match(/(.*\/v\d+\/)(.*)/);
    if (cloudinaryMatch) {
      const baseUrl = cloudinaryMatch[1];
      const restOfUrl = cloudinaryMatch[2];
      
      // Build transformation string
      const transformation = `w_${width},q_${quality},f_${format},c_${crop},g_${gravity}`;
      
      return `${baseUrl}${transformation}/${restOfUrl}`;
    }

    // Fallback: if URL doesn't match expected pattern, append query params
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&f=${format}`;
  } catch (error) {
    // Return original URL if optimization fails
    return url;
  }
}

/**
 * Generate srcset for responsive images.
 * @param {string} url - Cloudinary URL
 * @returns {string} - Srcset string for responsive images
 */
export function getImageSrcSet(url) {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  return [
    `${getOptimizedImageUrl(url, { width: 300 })} 300w`,
    `${getOptimizedImageUrl(url, { width: 400 })} 400w`,
    `${getOptimizedImageUrl(url, { width: 600 })} 600w`,
    `${getOptimizedImageUrl(url, { width: 800 })} 800w`,
  ].join(', ');
}

/**
 * Get sizes attribute for responsive images.
 * @param {boolean} isMobile - Is mobile viewport
 * @returns {string} - Sizes attribute
 */
export function getImageSizes(isMobile = false) {
  return isMobile 
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}
