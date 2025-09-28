import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import adminModel from "../admins/adminModel.js";
import { getLog } from "../utils/logger.js";

const tokenExpiration = process.env.TOKEN_EXPIRATION || 60 * 60 * 24 * 30; // 30 days

const cookieOptions = {
  // user cant edit your http calls
  httpOnly: true,
  // requires https when true
  secure: false,
  signed: true,
  maxAge: tokenExpiration,
  sameSite: "none",
  domain: "localhost",
  path: "/",
};

// Backend Token
const createToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  // Creating token for user
  return jwt.sign(user, jwtSecret, { expiresIn: tokenExpiration });
};

const authLogin = async (req, res, next) => {
  const { _id } = req.user;
  const log = getLog(req, { event: 'auth.login' });
  log.debug({ userId: _id }, 'issuing token');

  try {
    const user = await adminModel.findOne({ _id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  // Minimal safe log (avoid printing password/token). User found and authenticated.

    const token = createToken({ _id });
    // Do not log raw tokens in production

    // Lets you be logged in from multiple places at once
    if (Array.isArray(user.token)) {
      user.token.push({ token });
      // Cap to last 5 sessions to avoid unbounded growth
      if (user.token.length > 5) {
        user.token = user.token.slice(-5);
      }
    } else {
      user.token = [{ token }];
    }

    await user.save();
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        id: user._id,
      },
    });
  } catch (err) {
  log.error({ err: err?.message }, 'auth login error');
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};

export default authLogin;
