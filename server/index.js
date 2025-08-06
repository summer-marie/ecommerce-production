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
// Security Middleware
import { securityHeaders, generalRateLimit } from "./middleware/security.js";
import { requestLogger, errorLogger, logInfo, logError, logWarn } from "./middleware/logger.js";
// Routes
import authRouter from "./auth/authIndex.js";
import userRouter from "./user/userIndex.js";
import orderIndex from "./orders/orderIndex.js";
import ingredientsIndex from "./ingredients/ingredientsIndex.js";
import builderIndex from "./builders/builderIndex.js";
import msgIndex from "./messages/msgIndex.js";

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

// Security Middleware (apply early)
app.use(securityHeaders);
app.use(generalRateLimit);
app.use(requestLogger);

app.use(express.json({ limit: '10mb' })); // Add size limit

// const upload = multer({ dest: "uploads/" });

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

// register routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/orders", orderIndex);
app.use("/ingredients", ingredientsIndex);
app.use("/builders", builderIndex);
app.use("/messages", msgIndex);

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
