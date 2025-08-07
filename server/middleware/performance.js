// API Performance and Caching Middleware
import compression from "compression";
import { logInfo, logWarn, logError } from "./logger.js";

// Simple in-memory cache for small applications
const memoryCache = new Map();

// Cache cleanup function to prevent memory leaks
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

// Compression middleware
export const compressionMiddleware = compression({
  level: 6, // Good balance between compression and CPU usage
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if no-compression header is present
    if (req.headers["x-no-compression"]) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  },
});

// In-memory cache middleware factory (perfect for your scale)
export const cacheMiddleware = (duration = 300) => {
  // 5 minutes default
  return async (req, res, next) => {
    // Skip caching for POST, PUT, DELETE requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;
    const now = Date.now();

    try {
      // Check in-memory cache
      const cached = memoryCache.get(cacheKey);

      if (cached && cached.expires > now) {
        logInfo("Memory cache hit", { url: req.originalUrl });
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Cache-Type", "Memory");
        return res.json(cached.data);
      }

      // Cache miss - store original res.json
      const originalJson = res.json;
      res.json = function (data) {
        // Store in memory cache for future requests
        if (res.statusCode === 200) {
          memoryCache.set(cacheKey, {
            data: data,
            expires: now + (duration * 1000) // Convert seconds to milliseconds
          });
        }

        res.setHeader("X-Cache", "MISS");
        res.setHeader("X-Cache-Type", "Memory");
        logInfo("Memory cache miss", { url: req.originalUrl });
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logWarn("Cache middleware error", { error: error.message });
      next();
    }
  };
};

// Cache invalidation helper for in-memory cache
export const invalidateCache = async (pattern) => {
  try {
    let removed = 0;
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern.replace('*', ''))) {
        memoryCache.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
      logInfo("Memory cache invalidated", { pattern, keysRemoved: removed });
    }
  } catch (error) {
    logWarn("Cache invalidation failed", { error: error.message });
  }
};

// Performance monitoring middleware
export const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;

    // Log slow requests
    if (duration > 1000) {
      logWarn("Slow API request detected", {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        userAgent: req.get("user-agent"),
      });
    }

    // Add performance header (only if headers haven't been sent)
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${duration}ms`);
    }

    return originalEnd.apply(this, args);
  };

  next();
};

// Database query optimization middleware
export const dbOptimizationMiddleware = (req, res, next) => {
  // Add lean() to mongoose queries for better performance
  req.mongooseOptions = {
    lean: true, // Return plain objects instead of mongoose documents
    maxTimeMS: 5000, // 5 second timeout for queries
  };

  next();
};

// Export memory cache for manual operations if needed
export { memoryCache };
