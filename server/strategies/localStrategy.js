import passport from "passport";
import { Strategy } from "passport-local";
import * as argon2 from "argon2";
import userModel from "../admins/adminModel.js";
import { getLog } from "../utils/logger.js";

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
  const log = getLog(null, { operationId: 'localStrategyLogin' });
  log.info({ event: 'auth.login.attempt', email: normalizedEmail }, 'Attempting login');

      const user = await userModel.findOne({ email: normalizedEmail });
      if (!user) {
        log.warn({ event: 'auth.login.noUser', email: normalizedEmail }, 'No user found for email');
        return done(null, false, { message: "Invalid credentials" });
      }

      if (user.status && user.status !== "active") {
        log.warn({ event: 'auth.login.inactive', email: normalizedEmail, status: user.status }, 'User not active');
        return done(null, false, { message: "Account is not active" });
      }

      const isPasswordCorrect = await argon2.verify(user.password, password);
      if (!isPasswordCorrect) {
        log.warn({ event: 'auth.login.badPassword', email: normalizedEmail }, 'Incorrect password');
        return done(null, false, { message: "Invalid credentials" });
      }

      log.info({ event: 'auth.login.success', email: normalizedEmail, userId: user._id }, 'Login successful');
      return done(null, user);
    } catch (err) {
      const log = getLog(null, { operationId: 'localStrategyLogin' });
      log.error({ event: 'auth.login.error', err: err && err.message ? err.message : err }, 'Login error');
      return done(err, null);
    }
  })
);
