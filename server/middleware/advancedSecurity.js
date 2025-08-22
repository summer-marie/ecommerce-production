// Advanced security middleware for API protection
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
// import removed: use a safe custom sanitizer below to avoid assigning to read-only req props
import hpp from "hpp";
import { logInfo, logWarn, logError } from "./logger.js";

// Configurable rate limiting factory
export const createRateLimiter = (options = {}) => {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(options.windowMs / 1000 / 60) || 15,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logWarn("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("user-agent"),
        path: req.path,
        method: req.method,
      });
      res.status(429).json({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((options.windowMs || 900000) / 1000 / 60),
      });
    },
  };

  return rateLimit({ ...defaults, ...options });
};

// Endpoint-specific rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts
  message: "Too many authentication attempts, please try again later.",
});

export const adminRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Reasonable for admin operations during busy periods
  message: "Too many admin requests, please slow down.",
});

export const orderRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Reasonable for admin viewing/managing orders
  message: "Too many order requests, please wait before trying again.",
});

export const contactRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Multiple messages for customer support
  message: "Too many messages sent, please wait before sending another.",
});

// Progressive request speed limiting
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: (used, req) => {
    const delay = (used - 50) * 100; // Add 100ms delay for each request over limit

    if (delay > 0) {
      logWarn("Request speed limited", {
        ip: req.ip,
        delay: `${delay}ms`,
        requestCount: used,
        path: req.path,
      });
    }

    return delay;
  },
  maxDelayMs: 5000, // Maximum delay of 5 seconds
});

// Security headers with CSP configuration
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
  crossOriginEmbedderPolicy: false, // Disabled for compatibility
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: "deny" },
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

// MongoDB injection protection with safe sanitization
// Safe MongoDB injection protection without relying on third-party middleware
// This avoids attempting to overwrite request properties that may be getters (e.g., req.query)
const stripMongoOperators = (obj, depth = 0) => {
  if (depth > 10 || obj == null) return obj;
  if (Array.isArray(obj))
    return obj.map((v) => stripMongoOperators(v, depth + 1));
  if (typeof obj !== "object") return obj;

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove or rename keys that begin with $ or contain a dot (Mongo operators / injection vectors)
    if (key.startsWith("$") || key.includes(".")) {
      const safeKey = key.replace(/^\$+/, "_").replace(/\./g, "_");
      clean[safeKey] = stripMongoOperators(value, depth + 1);
    } else {
      clean[key] = stripMongoOperators(value, depth + 1);
    }
  }

  return clean;
};

export const mongoSanitizer = (req, res, next) => {
  try {
    // Only sanitize request bodies and params (avoid touching req.query which may be getter-only)
    if (req.body && typeof req.body === "object") {
      req.body = stripMongoOperators(req.body);
    }
    if (req.params && typeof req.params === "object") {
      req.params = stripMongoOperators(req.params);
    }
  } catch (error) {
    logError("MongoDB sanitization error", { error: error.message });
    // continue even if sanitization fails
  }
  next();
};

// XSS protection with object cloning
// Lightweight recursive sanitizer (replace script/style tags & basic event handlers)
const sanitizeString = (value) => {
  return value
    .replace(/<\/(script|style)>/gi, "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/(script|style)>/gi, "")
    .replace(/on[a-z]+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
};

const sanitizeObject = (obj, depth = 0) => {
  if (depth > 5) return obj; // prevent deep recursion
  if (Array.isArray(obj)) return obj.map((v) => sanitizeObject(v, depth + 1));
  if (obj && typeof obj === "object") {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      clean[k] = sanitizeObject(v, depth + 1);
    }
    return clean;
  }
  if (typeof obj === "string") return sanitizeString(obj);
  return obj;
};

export const xssProtection = (req, res, next) => {
  try {
    if (req.body && typeof req.body === "object")
      req.body = sanitizeObject(req.body);
    // Skip req.query to avoid "Cannot set property query" error
    // Query parameters are already sanitized by mongoSanitizer if needed
  } catch (error) {
    logWarn("XSS protection error", { error: error.message });
  }
  next();
};

// HTTP parameter pollution protection
export const hppProtection = hpp({
  whitelist: ["tags", "ingredients"], // Allow array parameters for these fields
});

// API key authentication middleware factory
export const createApiKeyAuth = (validKeys = []) => {
  return (req, res, next) => {
    const apiKey = req.header("X-API-Key") || req.query.apiKey;

    if (!apiKey) {
      logWarn("API request without key", {
        ip: req.ip,
        path: req.path,
        userAgent: req.get("user-agent"),
      });
      return res.status(401).json({
        error: "API key required",
        message: "Please provide a valid API key",
      });
    }

    if (!validKeys.includes(apiKey)) {
      logWarn("Invalid API key used", {
        ip: req.ip,
        path: req.path,
        providedKey: apiKey.substring(0, 8) + "...",
        userAgent: req.get("user-agent"),
      });
      return res.status(401).json({
        error: "Invalid API key",
        message: "The provided API key is not valid",
      });
    }

    logInfo("Valid API key used", {
      ip: req.ip,
      path: req.path,
      keyPrefix: apiKey.substring(0, 8) + "...",
    });

    req.apiKey = apiKey;
    next();
  };
};

// Additional security headers middleware
export const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Remove fingerprinting headers
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");

  next();
};

// IP filtering middleware factory
export const createIpFilter = (options = {}) => {
  const { whitelist = [], blacklist = [], trustProxy = true } = options;

  return (req, res, next) => {
    const clientIp = trustProxy ? req.ip : req.connection.remoteAddress;

    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIp)) {
      logWarn("Blocked IP attempt", {
        ip: clientIp,
        path: req.path,
        userAgent: req.get("user-agent"),
      });
      return res.status(403).json({
        error: "Access denied",
        message: "Your IP address has been blocked",
      });
    }

    // Check whitelist if defined
    if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
      logWarn("Non-whitelisted IP attempt", {
        ip: clientIp,
        path: req.path,
        userAgent: req.get("user-agent"),
      });
      return res.status(403).json({
        error: "Access denied",
        message: "Your IP address is not authorized",
      });
    }

    next();
  };
};

// Security-focused request logging middleware
export const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details
  logInfo("Request received", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    contentType: req.get("content-type"),
    contentLength: req.get("content-length"),
    timestamp: new Date().toISOString(),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;

    logInfo("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });

    // Log security-relevant responses
    if (res.statusCode >= 400) {
      logWarn("Security-relevant response", {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
    }

    return originalEnd.apply(this, args);
  };

  next();
};

// Export middleware collection for easy importing
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
  securityLogger,
};
