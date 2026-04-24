/**
 * Simple in-memory caching service for frequently accessed data.
 * Stores data with TTL (time-to-live) in milliseconds.
 * Perfect for product listings, which don't change frequently.
 */

const cache = new Map();

/**
 * Get a value from cache if it exists and hasn't expired.
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if expired/not found
 */
export function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

/**
 * Set a value in cache with TTL.
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttlMs - Time-to-live in milliseconds (default: 5 minutes)
 */
export function setCached(key, value, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Invalidate (clear) specific cache key(s).
 * Supports wildcards: 'products:list:*' will match all list keys.
 * @param {...string} keys - Keys to invalidate
 */
export function invalidateCache(...keys) {
  keys.forEach(key => {
    if (key.includes('*')) {
      // Wildcard pattern matching
      const pattern = key.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      Array.from(cache.keys()).forEach(k => {
        if (regex.test(k)) cache.delete(k);
      });
    } else {
      cache.delete(key);
    }
  });
}

/**
 * Clear all cache.
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Get cache statistics (for monitoring).
 * @returns {Object} - Cache size and other stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
