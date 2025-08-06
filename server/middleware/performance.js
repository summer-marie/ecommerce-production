// API Performance and Caching Middleware
import compression from 'compression';
import Redis from 'ioredis';
import { logInfo, logWarn, logError } from './logger.js';

// Initialize Redis client for caching
let redisClient = null;

// Try to connect to Redis (optional - graceful degradation)
const initializeRedis = async () => {
  try {
    // Try local Redis first
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    await redisClient.ping();
    logInfo('Redis cache initialized', { host: process.env.REDIS_HOST || 'localhost' });
    
    // Set up error handling
    redisClient.on('error', (err) => {
      logWarn('Redis connection error - operating without cache', { error: err.message });
      redisClient = null;
    });

  } catch (error) {
    logWarn('Redis not available - operating without cache', { error: error.message });
    redisClient = null;
  }
};

// Initialize Redis on startup
initializeRedis();

// Compression middleware
export const compressionMiddleware = compression({
  level: 6, // Good balance between compression and CPU usage
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if no-compression header is present
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  }
});

// Cache middleware factory
export const cacheMiddleware = (duration = 300) => { // 5 minutes default
  return async (req, res, next) => {
    // Skip caching for POST, PUT, DELETE requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if Redis is not available
    if (!redisClient) {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;

    try {
      // Try to get from cache
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        logInfo('Cache hit', { url: req.originalUrl });
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      // Cache miss - store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Store in cache for future requests
        if (res.statusCode === 200) {
          redisClient.setex(cacheKey, duration, JSON.stringify(data))
            .catch(err => logWarn('Cache store failed', { error: err.message }));
        }
        
        res.setHeader('X-Cache', 'MISS');
        logInfo('Cache miss', { url: req.originalUrl });
        return originalJson.call(this, data);
      };

      next();

    } catch (error) {
      logWarn('Cache middleware error', { error: error.message });
      next();
    }
  };
};

// Cache invalidation helper
export const invalidateCache = async (pattern) => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      logInfo('Cache invalidated', { pattern, keysRemoved: keys.length });
    }
  } catch (error) {
    logWarn('Cache invalidation failed', { error: error.message });
  }
};

// Performance monitoring middleware
export const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      logWarn('Slow API request detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent')
      });
    }
    
    // Add performance header
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

// Database query optimization middleware
export const dbOptimizationMiddleware = (req, res, next) => {
  // Add lean() to mongoose queries for better performance
  req.mongooseOptions = {
    lean: true, // Return plain objects instead of mongoose documents
    maxTimeMS: 5000 // 5 second timeout for queries
  };
  
  next();
};

// Export Redis client for manual cache operations
export { redisClient };
