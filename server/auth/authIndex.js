import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import adminModel from "../admins/adminModel.js";
import { getLog } from "../utils/logger.js";
import authLogin from "./authLogin.js";
import authStatus from "./authStatus.js";
import authChangePassword from "./authChangePassword.js";
import authChangeEmail from "./authChangeEmail.js";
import authLogout from "./authLogout.js";

const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
  const log = getLog(req, { event: 'auth.login.attempt' });
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      log.error({ err: err?.message }, 'passport authentication error');
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
      log.warn({ info: info?.message || info }, 'invalid credentials');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        log.error({ err: err?.message }, 'login session error');
        return res.status(500).json({
          success: false,
          message: "Login session failed",
          error:
            process.env.NODE_ENV === "development"
              ? err.message
              : "Internal server error",
        });
      }
      log.info({ userId: user._id }, 'user authenticated');
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
  (req, res, next) => { next(); },
  (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      const log = getLog(req, { event: 'auth.changePassword.attempt' });
      if (err) { log.error({ err: err?.message }, 'jwt auth error'); return res.status(500).json({ success: false, message: "Auth error" }); }
      if (!user) { log.warn({ info: info?.message || info }, 'auth failed'); return res.status(401).json({ success: false, message: "Authentication failed", info: info?.message || info }); }
      req.user = user; return authChangePassword(req, res);
    })(req, res, next);
  }
);

// Change email (admin must be authenticated)
authRouter.post(
  "/change-email",
  (req, res, next) => { next(); },
  (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      const log = getLog(req, { event: 'auth.changeEmail.attempt' });
      if (err) { log.error({ err: err?.message }, 'jwt auth error'); return res.status(500).json({ success: false, message: "Auth error" }); }
      if (!user) { log.warn({ info: info?.message || info }, 'auth failed'); return res.status(401).json({ success: false, message: "Authentication failed", info: info?.message || info }); }
      req.user = user; return authChangeEmail(req, res);
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
