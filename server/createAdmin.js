import "dotenv/config";
import mongoose from "mongoose";
import * as argon2 from "argon2";
import adminModel from "./admins/adminModel.js";

const createAdmin = async () => {
  try {
  // Connect to MongoDB (use Atlas URL)
  await mongoose.connect(process.env.MONGODB_ATLAS_URL);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: "admin@pizza.com" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await argon2.hash("admin123");

    // Create admin user
    const admin = new adminModel({
      firstName: "Admin",
      lastName: "User", 
      email: "admin@pizza.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      token: []
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@pizza.com");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
