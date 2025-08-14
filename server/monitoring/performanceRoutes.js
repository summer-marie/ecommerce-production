// Performance monitoring and health check endpoints
import mongoose from 'mongoose';
import { memoryCache } from '../middleware/performance.js';
import { logInfo, logError } from '../middleware/logger.js';

// Health check endpoint for monitoring service status
export const healthCheck = async (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'checking...',
      cache: 'checking...',
      server: 'OK'
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }
  };

  try {
    // Check MongoDB connection status
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.database = 'OK';
    } else {
      healthStatus.services.database = 'ERROR';
      healthStatus.status = 'DEGRADED';
    }

    // Verify in-memory cache is accessible
    const cacheSize = memoryCache.size;
    healthStatus.services.cache = cacheSize >= 0 ? 'OK' : 'ERROR';

    const statusCode = healthStatus.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    healthStatus.status = 'ERROR';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
};

// Detailed performance metrics for system monitoring
export const performanceMetrics = async (req, res) => {
  try {
    const dbStats = await mongoose.connection.db.stats();
    
    const metrics = {
      database: {
        collections: dbStats.collections,
        dataSize: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        indexSize: `${(dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`,
        avgObjSize: `${dbStats.avgObjSize} bytes`
      },
      server: {
        uptime: `${Math.floor(process.uptime())} seconds`,
        memory: {
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          external: `${(process.memoryUsage().external / 1024 / 1024).toFixed(2)} MB`
        },
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    // Calculate cache efficiency metrics
    const cacheSize = memoryCache.size;
    const cacheKeys = Array.from(memoryCache.keys());
    const now = Date.now();
    const activeKeys = cacheKeys.filter(key => {
      const cached = memoryCache.get(key);
      return cached && cached.expires > now;
    });

    metrics.cache = {
      status: 'in-memory',
      totalKeys: cacheSize,
      activeKeys: activeKeys.length,
      expiredKeys: cacheSize - activeKeys.length,
      memoryEstimate: `${(JSON.stringify([...memoryCache.entries()]).length / 1024).toFixed(2)} KB`
    };

    logInfo('Performance metrics requested');
    res.json(metrics);

  } catch (error) {
    logError('Error getting performance metrics', { error: error.message });
    res.status(500).json({ 
      error: 'Failed to get performance metrics',
      message: error.message 
    });
  }
};

// Cache statistics and active key analysis
export const cacheStats = async (req, res) => {
  try {
    const cacheKeys = Array.from(memoryCache.keys());
    const now = Date.now();
    const activeKeys = [];
    const expiredKeys = [];

    cacheKeys.forEach(key => {
      const cached = memoryCache.get(key);
      if (cached && cached.expires > now) {
        activeKeys.push(key);
      } else {
        expiredKeys.push(key);
      }
    });

    const stats = {
      status: 'in-memory',
      totalKeys: memoryCache.size,
      activeKeys: activeKeys.length,
      expiredKeys: expiredKeys.length,
      sampleKeys: activeKeys.slice(0, 10), // Show first 10 active keys
      memoryEstimate: `${(JSON.stringify([...memoryCache.entries()]).length / 1024).toFixed(2)} KB`
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get cache stats',
      message: error.message 
    });
  }
};