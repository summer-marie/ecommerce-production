// Performance optimization and caching middleware
import compression from "compression";
import { logger } from "../utils/logger.js";

// In-memory cache for small-scale applications
const memoryCache = new Map();

// Automatic cache cleanup to prevent memory leaks
const cleanupExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of memoryCache.entries()) {
    if (value.expires < now) {
      memoryCache.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCache, 5 * 60 * 1000);

// Response compression middleware
export const compressionMiddleware = compression({
  level: 6, // Balance between compression and CPU usage
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Skip compression if no-compression header present
    if (req.headers["x-no-compression"]) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  },
});

// In-memory cache middleware factory
export const cacheMiddleware = (duration = 300) => {
  // Default 5 minutes
  return async (req, res, next) => {
    // Skip caching for POST, PUT, DELETE requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;
    const now = Date.now();

    try {
      // Check memory cache for existing data
      const cached = memoryCache.get(cacheKey);

      if (cached && cached.expires > now) {
  logger.info({ url: req.originalUrl }, "Memory cache hit");
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Cache-Type", "Memory");
        return res.json(cached.data);
      }

      // Cache miss - store response for future requests
      const originalJson = res.json;
      res.json = function (data) {
        // Store successful responses in memory cache
        if (res.statusCode === 200) {
          memoryCache.set(cacheKey, {
            data: data,
            expires: now + duration * 1000, // Convert seconds to milliseconds
          });
        }

        res.setHeader("X-Cache", "MISS");
        res.setHeader("X-Cache-Type", "Memory");
  logger.info({ url: req.originalUrl }, "Memory cache miss");
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
  logger.warn({ error: error.message }, "Cache middleware error");
      next();
    }
  };
};

// Cache invalidation helper for pattern-based clearing
export const invalidateCache = async (pattern) => {
  try {
    let removed = 0;
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern.replace("*", ""))) {
        memoryCache.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
  logger.info({ pattern, keysRemoved: removed }, "Memory cache invalidated");
    }
  } catch (error) {
  logger.warn({ error: error.message }, "Cache invalidation failed");
  }
};

// Response time monitoring middleware
export const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Override response end to capture timing
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;

    // Alert on slow requests with different thresholds for different endpoints
    const isPaymentEndpoint = req.originalUrl?.includes('/payments/') || req.originalUrl?.includes('/square/');
    const slowThreshold = isPaymentEndpoint ? 2000 : 1000; // 2s for payments, 1s for others
    
    if (duration > slowThreshold) {
      logger.warn({
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        threshold: `${slowThreshold}ms`,
        userAgent: req.get("user-agent"),
      }, "Slow API request detected");
    }

    // Add response time header for debugging
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${duration}ms`);
    }

    return originalEnd.apply(this, args);
  };

  next();
};

// Export memory cache for direct access if needed
export { memoryCache };
