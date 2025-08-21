import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import adminModel from "../admins/adminModel.js";

const jwtSecret = process.env.JWT_SECRET || "secret";
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
  console.log("createToken user", user);
  return jwt.sign(user, jwtSecret, { expiresIn: tokenExpiration });
};

const authLogin = async (req, res, next) => {
  const { _id } = req.user;
  console.log("authLogin _id", _id);

  try {
    const user = await adminModel.findOne({ _id });
    console.log("authLogin/user", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = createToken({ _id });
    console.log("authLogin/token", token);

    // Lets you be logged in from multiple places at once
    if (user.token) {
      user.token.push({ token });
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
        role: user.role,
        id: user._id,
      },
    });
  } catch (err) {
    console.error("authLogin error:", err);
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
