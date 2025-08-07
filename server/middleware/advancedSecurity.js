// Advanced Security Middleware - Phase 4
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import { logInfo, logWarn, logError } from './logger.js';

// Advanced Rate Limiting Configuration
export const createRateLimiter = (options = {}) => {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) || 15
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logWarn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        path: req.path,
        method: req.method
      });
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((options.windowMs || 900000) / 1000 / 60)
      });
    }
  };

  return rateLimit({ ...defaults, ...options });
};

// Specific Rate Limiters for Different Endpoints
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts
  message: 'Too many authentication attempts, please try again later.'
});

export const adminRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // More restrictive for admin endpoints
  message: 'Too many admin requests, please slow down.'
});

export const orderRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // More reasonable for admin viewing/managing orders
  message: 'Too many order requests, please wait before trying again.'
});

export const contactRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Very restrictive for contact form
  message: 'Too many messages sent, please wait before sending another.'
});

// Speed Limiting (Slow Down Middleware)
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: (used, req) => {
    const delay = (used - 50) * 100; // Add 100ms delay for each request over the limit
    
    if (delay > 0) {
      logWarn('Request speed limited', {
        ip: req.ip,
        delay: `${delay}ms`,
        requestCount: used,
        path: req.path
      });
    }
    
    return delay;
  },
  maxDelayMs: 5000, // Maximum delay of 5 seconds
});

// Advanced Helmet Configuration
export const advancedHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.mongodb.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for compatibility
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// MongoDB Injection Protection - Safe configuration
export const mongoSanitizer = (req, res, next) => {
  try {
    // Only sanitize if the object is modifiable
    if (req.body && typeof req.body === 'object') {
      req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    }
    if (req.params && typeof req.params === 'object') {
      req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    }
    next();
  } catch (error) {
    logError('MongoDB sanitization error', { error: error.message });
    next(); // Continue even if sanitization fails
  }
};

// XSS Protection - Temporarily disabled due to Express compatibility
export const xssProtection = (req, res, next) => {
  // Simple XSS protection without modifying immutable objects
  if (req.body && typeof req.body === 'object') {
    try {
      req.body = JSON.parse(JSON.stringify(req.body)); // Deep clone
      // Add basic XSS filtering here if needed
    } catch (error) {
      logWarn('XSS protection error', { error: error.message });
    }
  }
  next();
};

// HTTP Parameter Pollution Protection
export const hppProtection = hpp({
  whitelist: ['tags', 'ingredients'] // Allow array parameters for these fields
});

// API Key Authentication Middleware
export const createApiKeyAuth = (validKeys = []) => {
  return (req, res, next) => {
    const apiKey = req.header('X-API-Key') || req.query.apiKey;
    
    if (!apiKey) {
      logWarn('API request without key', {
        ip: req.ip,
        path: req.path,
        userAgent: req.get('user-agent')
      });
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide a valid API key'
      });
    }

    if (!validKeys.includes(apiKey)) {
      logWarn('Invalid API key used', {
        ip: req.ip,
        path: req.path,
        providedKey: apiKey.substring(0, 8) + '...',
        userAgent: req.get('user-agent')
      });
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }

    logInfo('Valid API key used', {
      ip: req.ip,
      path: req.path,
      keyPrefix: apiKey.substring(0, 8) + '...'
    });

    req.apiKey = apiKey;
    next();
  };
};

// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
};

// IP Whitelist/Blacklist Middleware
export const createIpFilter = (options = {}) => {
  const { whitelist = [], blacklist = [], trustProxy = true } = options;
  
  return (req, res, next) => {
    const clientIp = trustProxy ? req.ip : req.connection.remoteAddress;
    
    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIp)) {
      logWarn('Blocked IP attempt', {
        ip: clientIp,
        path: req.path,
        userAgent: req.get('user-agent')
      });
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address has been blocked'
      });
    }
    
    // Check whitelist if defined
    if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
      logWarn('Non-whitelisted IP attempt', {
        ip: clientIp,
        path: req.path,
        userAgent: req.get('user-agent')
      });
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP address is not authorized'
      });
    }
    
    next();
  };
};

// Request Logging with Security Context
export const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  logInfo('Request received', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    contentType: req.get('content-type'),
    contentLength: req.get('content-length'),
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    logInfo('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
    
    // Log security-relevant responses
    if (res.statusCode >= 400) {
      logWarn('Security-relevant response', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
    }
    
    return originalEnd.apply(this, args);
  };
  
  next();
};

// Export all middleware for easy import
export default {
  createRateLimiter,
  authRateLimit,
  adminRateLimit,
  orderRateLimit,
  contactRateLimit,
  speedLimiter,
  advancedHelmet,
  mongoSanitizer,
  xssProtection,
  hppProtection,
  createApiKeyAuth,
  securityHeaders,
  createIpFilter,
  securityLogger
};
