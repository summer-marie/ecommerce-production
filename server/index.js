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
  console.error("❌ JWT_SECRET environment variable is required");
  console.error("Please check your .env file and ensure JWT_SECRET is set");
  console.error(
    "Current JWT_SECRET value:",
    process.env.JWT_SECRET ? "[SET]" : "[MISSING]"
  );
  process.exit(1);
}

if (!process.env.MONGODB_ATLAS_URL) {
  console.error("❌ MONGODB_ATLAS_URL environment variable is required");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

// Add global error handlers to catch unhandled errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", {
    reason: reason,
    promise: promise,
    stack: reason?.stack,
  });
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("❌ SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("❌ SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Dynamically import authentication strategies after environment is validated
await import("./strategies/jwtStrategy.js");
await import("./strategies/localStrategy.js");

// Express and Middleware
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
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
import paymentRoutes from "./payments/squareRoutes.js";
import operatingRoutes from "./operatingHours/operatingRoutes.js";
import scheduleMessageCleanup from "./utils/messageScheduler.js";
import { initializeScheduledTasks } from "./scheduledTasks.js";
import aboutRouter from "./about/aboutIndex.js";

// Replace console.log with proper logging
logInfo("Environment check", {
  mongodbUrl: process.env.MONGODB_ATLAS_URL ? "Set" : "Missing",
});

const port = process.env.PORT || 8010;

const cookieSecret = process.env.COOKIE_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

const app = express();

// Trust proxy for Railway (fixes rate limiting X-Forwarded-For errors)
app.set("trust proxy", 1);

// Minimal health endpoint early in the pipeline to satisfy platform health checks
// This responds before any heavy middleware or DB-dependent logic runs.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Serve favicon if present in client build or public folder to avoid noisy 404s in logs
try {
  const favCandidates = [
    path.join(__dirname, "../client/dist/favicon.ico"),
    path.join(__dirname, "../client/public/favicon.ico"),
    path.join(__dirname, "favicon.ico"),
  ];
  let favPath = favCandidates.find((p) => fs.existsSync(p));
  // If no favicon exists, write a tiny default (1x1 transparent PNG) to server/public/favicon.ico
  if (!favPath) {
    try {
      const defaultDir = path.join(__dirname, "public");
      if (!fs.existsSync(defaultDir))
        fs.mkdirSync(defaultDir, { recursive: true });
      const target = path.join(defaultDir, "favicon.ico");
      if (!fs.existsSync(target)) {
        const defaultFaviconBase64 =
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
        fs.writeFileSync(target, Buffer.from(defaultFaviconBase64, "base64"));
      }
      favPath = target;
    } catch (writeErr) {
      console.warn("Failed to write default favicon:", writeErr.message);
    }
  }
  if (favPath) {
    app.get("/favicon.ico", (req, res) => {
      res.sendFile(favPath);
    });
  }
} catch (err) {
  // Non-fatal — just skip favicon serving if anything goes wrong
  console.warn("Favicon route setup skipped:", err.message);
}

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

// Webhook raw body (must be BEFORE express.json so signature can be verified)
app.use("/payments/square/webhook", express.raw({ type: "application/json" }));

// Input sanitization and protection against common attacks (after raw webhook)
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

// Simple health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Pizza app server is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8010,
  });
});

// Health check for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// NOTE: express-session MUST be registered before passport.initialize() and any route
// handlers that call req.logIn / rely on sessions. It was previously after the routes,
// which caused: "Login sessions require session support".

// Database connection and server startup
try {
  // Use Atlas URL exclusively to avoid accidental localhost fallback
  const mongoURL = process.env.MONGODB_ATLAS_URL;

  if (!mongoURL) {
    throw new Error(
      "No MongoDB connection string found in environment variables"
    );
  }

  console.log(
    `🔌 Connecting to MongoDB (${
      process.env.NODE_ENV === "production" ? "Atlas Cloud" : "Local/Atlas"
    })...`
  );

  // Connect to MongoDB with better error handling
  await mongoose.connect(mongoURL, {
    // These options help with connection stability
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });

  logInfo(`✅ Pizza app connected to database`, {
    host: mongoURL.includes("mongodb+srv")
      ? "MongoDB Atlas Cloud"
      : "Local MongoDB",
    environment: process.env.NODE_ENV || "development",
  });

  console.log("🔧 Setting up MongoDB session store...");

  // Configure session store after MongoDB connection is established
  try {
    app.use(
      session({
        secret: sessionSecret || "change_this_session_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          client: mongoose.connection.getClient(),
          dbName: mongoose.connection.db.databaseName,
          collectionName: "sessions",
          ttl: 24 * 60 * 60,
          touchAfter: 24 * 3600,
        }),
        cookie: {
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        },
        name: "sessionId",
      })
    );
    console.log("✅ MongoDB session store configured successfully");

    // Initialize passport & session support AFTER express-session
    app.use(passport.initialize());
    app.use(passport.session());
    console.log("✅ Passport initialized with session support");

  // API route registration with appropriate security and caching middleware
  // Apply auth rate limit only to the login endpoint to avoid throttling other auth actions
  app.use("/auth/login", authRateLimit);
  app.use("/auth", authRouter);
    app.use("/admins", adminRateLimit, adminRouter);
    app.use("/orders", orderIndex);
    app.use("/ingredients", cacheMiddleware(600), ingredientsIndex);
    app.use("/builders", cacheMiddleware(300), builderIndex);
    app.use("/messages", msgIndex);
    app.use("/payments", paymentRoutes);
  app.use("/operating-hours", operatingRoutes);
    app.use("/monitoring", adminRateLimit, monitoringRouter);
  app.use("/about", aboutRouter);

    // Administrative API key management (requires admin authentication)
    createApiKeyRoutes(app);

    // Self-documenting API endpoint
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
          about: "/about - Public About content (GET) and admin updates (PUT)",
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

    // Global error handling middleware (must remain last after routes)
    app.use(errorLogger);
  } catch (sessionError) {
    console.error("❌ Failed to setup session store:", sessionError);
    throw sessionError;
  }

  // Lightweight verification of key collections (non-blocking)
  try {
    const collectionsToCheck = ["ingredients", "builders"];
    for (const name of collectionsToCheck) {
      if (mongoose.connection.collections[name]) {
        const count = await mongoose.connection.collections[
          name
        ].countDocuments();
        logInfo("Collection count", { collection: name, count });
      }
    }
  } catch (verifyErr) {
    logWarn("Collection count check failed", { error: verifyErr.message });
  }

  console.log("🚀 Starting server...");

  app.listen(port, "0.0.0.0", () => {
    console.log("✅ Server is now listening for connections");
    logInfo(`🚀 Pizza app server started`, {
      port,
      host: "0.0.0.0",
      environment: process.env.NODE_ENV || "development",
      database: mongoURL.includes("mongodb+srv") ? "Atlas Cloud" : "Local",
    });

    // Start message cleanup scheduler
    scheduleMessageCleanup();

    // Start all other scheduled tasks (archived orders cleanup, etc.)
    initializeScheduledTasks();
  });
} catch (err) {
  console.error("❌ Startup error:", err);
  logError("❌ Database connection failed", { error: err.message });
  process.exit(1); // Exit process if database connection fails
}
