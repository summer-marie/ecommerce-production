import mongoose from "mongoose";
import * as argon2 from "argon2";
import adminModel from "./adminModel.js";

const ALLOWED_ROLES = ["admin", "manager"];
const ALLOWED_STATUS = ["active", "disabled"];

const adminCreate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      status = "active",
      role = "admin",
      authStrategy = "local",
    } = req.body || {};

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Normalize and validate enums
    const normalizedEmail = String(email).trim().toLowerCase();
    const safeRole = ALLOWED_ROLES.includes(role) ? role : "admin";
    const safeStatus = ALLOWED_STATUS.includes(status) ? status : "active";

    // Bootstrap guard: allow up to 2 admins to be created without auth; after that, require an authenticated admin
    const adminCount = await adminModel.countDocuments({});
    const isAuthenticatedAdmin = req.user && req.user.role === "admin";
    if (adminCount >= 2 && !isAuthenticatedAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Admin creation is disabled. Please sign in as an admin to add more admins.",
      });
    }

    // Check duplicates
    const existing = await adminModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create admin
    const created = await adminModel.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      status: safeStatus,
      role: safeRole,
      authStrategy,
      token: [],
    });

    // Structured log (avoid logging password)
    if (req.log) {
      req.log.info({
        event: 'admin.create',
        adminId: created._id,
        role: created.role,
        status: created.status,
        email: created.email,
        bootstrap: adminCount < 2,
      }, 'admin account created');
    }

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      id: created._id,
      role: created.role,
      status: created.status,
    });
  } catch (err) {
    if (req.log) {
      req.log.error({ event: 'admin.create.error', err: { message: err.message, name: err.name } }, 'admin create failed');
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default adminCreate;
