// Environment and Core Node Modules
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the same directory as this script
dotenv.config({ path: path.join(__dirname, ".env") });

// Verify critical environment variables are loaded
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  console.error('Please check your .env file and ensure JWT_SECRET is set');
  console.error('Current JWT_SECRET value:', process.env.JWT_SECRET ? '[SET]' : '[MISSING]');
  process.exit(1);
}

if (!process.env.MONGODB_URL) {
  console.error('❌ MONGODB_URL environment variable is required');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');

// Dynamically import authentication strategies after environment is validated
await import("./strategies/jwtStrategy.js");
await import("./strategies/localStrategy.js");

// Express and Middleware
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
// Database
import mongoose from "mongoose";
// Authentication
import passport from "passport";

// Security Middleware
import { securityHeaders, generalRateLimit } from "./middleware/security.js";
import {
  requestLogger,
  errorLogger,
  logInfo,
  logError,
  logWarn,
} from "./middleware/logger.js";
// Advanced Security Middleware 
import {
  advancedHelmet,
  mongoSanitizer,
  xssProtection,
  hppProtection,
  speedLimiter,
  securityLogger,
  authRateLimit,
  adminRateLimit,
  orderRateLimit,
  contactRateLimit,
} from "./middleware/advancedSecurity.js";
import { requireApiKey, createApiKeyRoutes } from "./middleware/apiKeyAuth.js";
// Performance Middleware 
import {
  compressionMiddleware,
  cacheMiddleware,
  performanceMiddleware,
  dbOptimizationMiddleware,
} from "./middleware/performance.js";
// Routes
import authRouter from "./auth/authIndex.js";
import adminRouter from "./admins/adminIndex.js";
import orderIndex from "./orders/orderIndex.js";
import ingredientsIndex from "./ingredients/ingredientsIndex.js";
import builderIndex from "./builders/builderIndex.js";
import msgIndex from "./messages/msgIndex.js";
import monitoringRouter from "./monitoring/index.js";

// Replace console.log with proper logging
logInfo("Environment check", {
  mongodbUrl: process.env.MONGODB_URL ? "Set" : "Missing",
});

const port = process.env.PORT || 8010;

const cookieSecret = process.env.COOKIE_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

// Create uploads directory in server folder
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Core security middleware - apply before any request processing
app.use(advancedHelmet); // Enhanced security headers (CSP, HSTS, etc.)
app.use(securityLogger); // Security-focused request logging with threat detection
app.use(speedLimiter); // Prevent rapid-fire requests from same IP

// Performance optimization - compress responses early in the pipeline
app.use(compressionMiddleware); // Gzip compression for faster response times
app.use(performanceMiddleware); // Response time tracking and monitoring

// Additional security layers and general rate limiting
app.use(securityHeaders); // Extra security headers for older browsers
app.use(generalRateLimit); // Global rate limit: 100 requests per 15 minutes
// Note: requestLogger removed to avoid duplicate logging with securityLogger

// Input sanitization and protection against common attacks
app.use(express.json({ limit: "10mb" })); // JSON parser with size limit for image uploads
app.use(mongoSanitizer); // Prevent MongoDB injection attacks (e.g., $gt, $ne)
app.use(xssProtection); // Sanitize HTML input to prevent XSS attacks
app.use(hppProtection); // Prevent HTTP Parameter Pollution attacks

app.use(cookieParser(cookieSecret));

// Cross-Origin Resource Sharing configuration for frontend communication
// Get whitelisted domains from environment variables
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];
// Configure CORS to only allow requests from approved domains
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
// Apply CORS middleware with security restrictions
app.use(cors(corsOptions));

// Static file serving for pizza images and other uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Simple health check endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Authentication middleware setup
app.use(passport.initialize());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// API route registration with appropriate security and caching middleware
app.use("/auth", authRateLimit, authRouter); // Authentication: 5 login attempts per 15 minutes
app.use("/admins", adminRateLimit, adminRouter); // Admin operations: 100 requests per 5 minutes
app.use("/orders", orderIndex); // Order management: individual routes have specific rate limits
app.use("/ingredients", cacheMiddleware(600), ingredientsIndex); // Pizza ingredients: cached for 10 minutes
app.use("/builders", cacheMiddleware(300), builderIndex); // Pizza templates: cached for 5 minutes
app.use("/messages", contactRateLimit, msgIndex); // Contact forms: 5 messages per hour
app.use("/monitoring", adminRateLimit, monitoringRouter); // System monitoring: admin-only access

// Administrative API key management (requires admin authentication)
createApiKeyRoutes(app);

// Self-documenting API endpoint for developers and integration partners
app.get("/api/docs", (req, res) => {
  res.json({
    title: "Pizza Business API",
    version: "1.0.0",
    description: "Secure, high-performance pizza ordering API",
    security: {
      apiKey: "Required for most endpoints - use X-API-Key header",
      jwt: "Required for admin operations - use Authorization header",
    },
    endpoints: {
      auth: "/auth/* - Authentication endpoints",
      orders: "/orders/* - Order management",
      ingredients: "/ingredients/* - Pizza ingredients",
      builders: "/builders/* - Pizza templates",
      messages: "/messages/* - Contact messages",
      monitoring: "/monitoring/* - Health & performance",
      apiKeys: "/api/admin/keys/* - API key management (admin only)",
    },
    rateLimits: {
      auth: "5 requests per 15 minutes",
      admin: "100 requests per 5 minutes",
      orders: "10 requests per 10 minutes",
      contact: "5 requests per hour",
      general: "100 requests per 15 minutes",
    },
  });
});

// Additional static file serving (backup path for uploads)
app.use("/uploads", express.static(uploadsDir));

// Global error handling middleware (must be last middleware)
app.use(errorLogger);

// Database connection and server startup
try {
  const mongoURL = process.env.MONGODB_URL || "";
  // Connect to MongoDB
  await mongoose.connect(mongoURL);
  logInfo(`Pizza app connected to database`, {
    host: mongoURL.split("@")[1] || "localhost",
  });

  app.listen(port, () => {
    logInfo(`Pizza app server started`, {
      port,
      environment: process.env.NODE_ENV,
    });
  });
} catch (err) {
  logError("Database connection failed", { error: err.message });
}
