import passport from "passport";
import { Strategy } from "passport-local";
import * as argon2 from "argon2";
import userModel from "../admins/adminModel.js";

passport.serializeUser((user, done) => {
  // console.log('serializeUser', user)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // console.log('deserializedUser', id)
  try {
    // Both work, so i kept them both for ref.
    // const findUser = await userModel.findById(id)
    const findUser = await userModel.findOne({ _id: id });
    if (!findUser) {
      throw new Error("Invalid credentials");
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const normalizedEmail = String(username || "").trim().toLowerCase();
      console.log("[Auth] Attempting login for email:", normalizedEmail);

      const user = await userModel.findOne({ email: normalizedEmail });
      if (!user) {
        console.log("[Auth] No user found for email:", normalizedEmail);
        return done(null, false, { message: "Invalid credentials" });
      }

      if (user.status && user.status !== "active") {
        console.log("[Auth] User not active:", normalizedEmail);
        return done(null, false, { message: "Account is not active" });
      }

      const isPasswordCorrect = await argon2.verify(user.password, password);
      if (!isPasswordCorrect) {
        console.log("[Auth] Password incorrect for user:", normalizedEmail);
        return done(null, false, { message: "Invalid credentials" });
      }

      console.log("[Auth] Login successful for user:", normalizedEmail);
      return done(null, user);
    } catch (err) {
      console.error("[Auth] Login error:", err);
      return done(err, null);
    }
  })
);
