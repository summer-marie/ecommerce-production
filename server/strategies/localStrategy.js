import passport from "passport";
import { Strategy } from "passport-local";
import * as argon2 from "argon2";
import adminModel from "../admins/adminModel.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await adminModel.findOne({ _id: id });
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
      const user = await adminModel.findOne({ email: username });

      if (!user) {
        return done(new Error("Invalid credentials"), null);
      }

      // Verify password using Argon2
      const isPasswordCorrect = await argon2.verify(user.password, password);

      if (!isPasswordCorrect) {
        return done(new Error("Invalid credentials"), null);
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);
