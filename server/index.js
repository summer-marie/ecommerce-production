// Environment and Core Node Modules
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
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
import "./strategies/jwtStrategy.js";
import "./strategies/localStrategy.js";
// Security Middleware (Phase 1)
import { securityHeaders, generalRateLimit } from "./middleware/security.js";
import { requestLogger, errorLogger, logInfo, logError, logWarn } from "./middleware/logger.js";
// Advanced Security Middleware (Phase 4)
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
  contactRateLimit
} from "./middleware/advancedSecurity.js";
import { requireApiKey, createApiKeyRoutes } from "./middleware/apiKeyAuth.js";
// Performance Middleware (Phase 2)
import { 
  compressionMiddleware, 
  cacheMiddleware, 
  performanceMiddleware,
  dbOptimizationMiddleware 
} from "./middleware/performance.js";
// Routes
import authRouter from "./auth/authIndex.js";
import userRouter from "./user/userIndex.js";
import orderIndex from "./orders/orderIndex.js";
import ingredientsIndex from "./ingredients/ingredientsIndex.js";
import builderIndex from "./builders/builderIndex.js";
import msgIndex from "./messages/msgIndex.js";
import monitoringRouter from "./monitoring/index.js";

// Replace console.log with proper logging
logInfo('Environment check', { mongodbUrl: process.env.MONGODB_URL ? 'Set' : 'Missing' });

const port = process.env.PORT || 8010;

const cookieSecret = process.env.COOKIE_SECRET;
const sessionSecret = process.env.SESSION_SECRET || "bubbles";

// Get the current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory in server folder
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Phase 4: Advanced Security Middleware (apply first)
app.use(advancedHelmet); // Advanced Helmet configuration
app.use(securityLogger); // Security-focused request logging
app.use(speedLimiter); // Request speed limiting

// Phase 2: Performance Middleware 
app.use(compressionMiddleware);
app.use(performanceMiddleware);

// Phase 1 & 4: Security Middleware 
app.use(securityHeaders);
app.use(generalRateLimit);
app.use(requestLogger);

// Phase 4: Input Sanitization & Protection
app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(mongoSanitizer); // MongoDB injection protection
app.use(xssProtection); // XSS protection
app.use(hppProtection); // HTTP Parameter Pollution protection

app.use(cookieParser(cookieSecret));

// Express CORS
// Get whitelisted domains from env
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];
// Set CORS options
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
// Use CORS
app.use(cors(corsOptions));

// Make the "uploads" folder publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Add Passport
app.use(passport.initialize());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// register routes with advanced security and caching
app.use("/auth", authRateLimit, authRouter); // Rate limit auth endpoints
app.use("/users", adminRateLimit, userRouter); // Rate limit user management
app.use("/orders", orderRateLimit, orderIndex); // Rate limit order creation
app.use("/ingredients", cacheMiddleware(600), ingredientsIndex); // Cache ingredients for 10 minutes
app.use("/builders", cacheMiddleware(300), builderIndex); // Cache pizza builders for 5 minutes
app.use("/messages", contactRateLimit, msgIndex); // Rate limit contact messages
app.use("/monitoring", adminRateLimit, monitoringRouter); // Performance monitoring endpoints

// Phase 4: API Key Management Routes (Admin only)
createApiKeyRoutes(app);

// API Documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    title: "Arizona Pizza Business API",
    version: "1.0.0",
    description: "Secure, high-performance pizza ordering API",
    security: {
      apiKey: "Required for most endpoints - use X-API-Key header",
      jwt: "Required for admin operations - use Authorization header"
    },
    endpoints: {
      auth: "/auth/* - Authentication endpoints",
      orders: "/orders/* - Order management", 
      ingredients: "/ingredients/* - Pizza ingredients",
      builders: "/builders/* - Pizza templates",
      messages: "/messages/* - Contact messages",
      monitoring: "/monitoring/* - Health & performance",
      apiKeys: "/api/admin/keys/* - API key management (admin only)"
    },
    rateLimits: {
      auth: "5 requests per 15 minutes",
      admin: "50 requests per 5 minutes", 
      orders: "10 requests per 10 minutes",
      contact: "3 requests per hour",
      general: "100 requests per 15 minutes"
    }
  });
});

app.use("/uploads", express.static(uploadsDir));

// Error handling middleware (add at the end)
app.use(errorLogger);

// MongoDB Setup
try {
  const mongoURL = process.env.MONGODB_URL || "";
  // Connect to MongoDB
  await mongoose.connect(mongoURL);
  logInfo(`Pizza app connected to database`, { host: mongoURL.split('@')[1] || 'localhost' });

  app.listen(port, () => {
    logInfo(`Pizza app server started`, { port, environment: process.env.NODE_ENV });
  });
} catch (err) {
  logError('Database connection failed', { error: err.message });
}
