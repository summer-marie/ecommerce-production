import "dotenv/config";
import mongoose from "mongoose";
import * as argon2 from "argon2";
import adminModel from "./admins/adminModel.js";
import { getLog } from "./utils/logger.js";

const createAdmin = async () => {
  try {
    // Connect to MongoDB (use Atlas URL)
  const log = getLog(null, { operationId: 'createAdmin' });
  await mongoose.connect(process.env.MONGODB_ATLAS_URL);
  log.info({ event: 'script.createAdmin.start' }, 'Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({
      email: "admin@pizza.com",
    });
    if (existingAdmin) {
      log.info({ event: 'script.createAdmin.exists', email: existingAdmin.email }, 'Admin user already exists');
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
      token: [],
    });

    await admin.save();
    log.info({ event: 'script.createAdmin.created', email: 'admin@pizza.com' }, 'Admin user created successfully');
    log.info({ event: 'script.createAdmin.credentials', email: 'admin@pizza.com', passwordHint: 'admin123 (dev default)' }, 'Admin credentials');
  } catch (error) {
    const log = getLog(null, { operationId: 'createAdmin' });
    log.error({ event: 'script.createAdmin.error', err: error && error.message ? error.message : error }, 'Error creating admin');
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
