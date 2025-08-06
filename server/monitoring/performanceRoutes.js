// Performance monitoring and health check endpoints
import mongoose from 'mongoose';
import { redisClient } from '../middleware/performance.js';
import { logInfo, logError } from '../middleware/logger.js';

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
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.database = 'OK';
    } else {
      healthStatus.services.database = 'ERROR';
      healthStatus.status = 'DEGRADED';
    }

    // Check Redis connection
    if (redisClient) {
      try {
        await redisClient.ping();
        healthStatus.services.cache = 'OK';
      } catch (error) {
        healthStatus.services.cache = 'ERROR';
      }
    } else {
      healthStatus.services.cache = 'DISABLED';
    }

    const statusCode = healthStatus.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    healthStatus.status = 'ERROR';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
};

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

    // Add cache metrics if Redis is available
    if (redisClient) {
      try {
        const info = await redisClient.info('memory');
        metrics.cache = {
          status: 'connected',
          memoryUsage: info.split('\r\n')
            .find(line => line.startsWith('used_memory_human:'))
            ?.split(':')[1] || 'N/A'
        };
      } catch (error) {
        metrics.cache = { status: 'error', error: error.message };
      }
    } else {
      metrics.cache = { status: 'disabled' };
    }

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

export const cacheStats = async (req, res) => {
  if (!redisClient) {
    return res.json({ 
      status: 'disabled',
      message: 'Cache is not available' 
    });
  }

  try {
    const keys = await redisClient.keys('api:*');
    const stats = {
      totalKeys: keys.length,
      keys: keys.slice(0, 10), // Show first 10 keys
      status: 'active'
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get cache stats',
      message: error.message 
    });
  }
};
