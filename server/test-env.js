import "dotenv/config";
import mongoose from "mongoose";

console.log("MONGODB_URL exists:", !!process.env.MONGODB_URL);
console.log("MONGODB_URL length:", process.env.MONGODB_URL?.length);
console.log(
  "MONGODB_URL starts with mongodb:",
  process.env.MONGODB_URL?.startsWith("mongodb")
);

try {
  const mongoURL = process.env.MONGODB_URL || "";
  console.log("mongoURL variable:", mongoURL.substring(0, 20) + "...");
  await mongoose.connect(mongoURL);
  console.log("✅ MongoDB connected successfully");
  process.exit(0);
} catch (err) {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
}
