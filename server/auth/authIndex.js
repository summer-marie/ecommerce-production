import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import adminModel from "../admins/adminModel.js";
import authLogin from "./authLogin.js";
import authStatus from "./authStatus.js";
import authChangePassword from "./authChangePassword.js";
import authLogout from "./authLogout.js";

const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
  // [Auth] Login request
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("[Auth] Passport authentication error:", err);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Internal server error",
      });
    }
    if (!user) {
  // Authentication failed - no user returned
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("[Auth] Login session error:", err);
        return res.status(500).json({
          success: false,
          message: "Login session failed",
          error:
            process.env.NODE_ENV === "development"
              ? err.message
              : "Internal server error",
        });
      }

  // User authenticated, issuing token
      authLogin(req, res, next);
    });
  })(req, res, next);
});

authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  authStatus
);

// Change password (admin must be authenticated) - simplified for now
authRouter.post(
  "/change-password",
  (req, res, next) => {
  // [Auth] Change password request
    next();
  },
  (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
  // Passport result processed
      if (err) return res.status(500).json({ success: false, message: "Auth error" });
      if (!user) return res.status(401).json({ success: false, message: "Authentication failed", info: info?.message || info });
      req.user = user;
      return authChangePassword(req, res);
    })(req, res, next);
  }
);

// Logout (invalidate current token and clear cookie) - simplified for now
authRouter.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authLogout
);

export default authRouter;
