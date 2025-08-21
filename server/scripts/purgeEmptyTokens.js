#!/usr/bin/env node
/**
 * Maintenance script: remove empty and expired JWT token entries from all admin documents.
 * Rules:
 *  - Drop any subdocument where token === ''
 *  - Decode JWT (silently catch errors); if exp < now, drop it
 *  - Keep valid (non-expired) tokens intact
 * Safe to run periodically (e.g., daily): `node scripts/purgeEmptyTokens.js`.
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import adminModel from "../admins/adminModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function run() {
  const mongoURL = process.env.MONGODB_ATLAS_URL;

  if (!mongoURL) {
    console.error("❌ No MongoDB connection string found.");
    process.exit(1);
  }

  await mongoose.connect(mongoURL);
  console.log("✅ Connected to MongoDB");

  const nowSec = Math.floor(Date.now() / 1000);
  const jwtSecret = process.env.JWT_SECRET;

  const admins = await adminModel.find({ token: { $exists: true, $ne: [] } });

  let totalEmpty = 0;
  let totalExpired = 0;
  let totalRemaining = 0;
  let modifiedDocs = 0;

  for (const admin of admins) {
    const originalCount = admin.token.length;
    const kept = [];
    for (const t of admin.token) {
      const raw = t.token;
      if (!raw || raw.trim() === "") {
        totalEmpty++;
        continue;
      }
      try {
        const decoded = jwt.verify(raw, jwtSecret); // also checks exp
        // If verify passes, token is valid (not expired)
        kept.push(t);
      } catch (err) {
        // jwt.verify throws for expired or invalid tokens
        if (err.name === "TokenExpiredError") {
          totalExpired++;
        } else {
          // treat any invalid/garbled token as expired/invalid
          totalExpired++;
        }
      }
    }
    if (kept.length !== originalCount) {
      admin.token = kept;
      await admin.save();
      modifiedDocs++;
    }
    totalRemaining += kept.length;
  }

  console.log("🧹 Purge summary:", {
    adminsScanned: admins.length,
    modifiedDocs,
    removedEmpty: totalEmpty,
    removedExpiredOrInvalid: totalExpired,
    remainingValidTokens: totalRemaining,
    timestamp: new Date().toISOString(),
  });
  await mongoose.disconnect();
  console.log("🔌 Disconnected");
}

run().catch((err) => {
  console.error("❌ Purge failed:", err);
  process.exit(1);
});
