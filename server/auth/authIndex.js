import { Router } from "express";
import passport from "passport";
import authLogin from "./authLogin.js";
import authStatus from "./authStatus.js";
import authLogout from "./authLogout.js";

const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
  console.log("[Auth] Login request received for:", req.body.email);
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
      console.log("[Auth] Authentication failed - no user returned");
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

      console.log("[Auth] User logged in successfully, calling authLogin");
      authLogin(req, res, next);
    });
  })(req, res, next);
});

authRouter.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  authStatus
);

authRouter.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authLogout
);

export default authRouter;
