import passport from "passport";
import { Strategy } from "passport-local";
import * as argon2 from "argon2";
import userModel from "../user/userModel.js";

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
  // passing in my instance
  new Strategy({ usernameField: "email" }, async (username, password, done) => {

    // search users in db
    try {
      const user = await userModel.findOne({ email: username });

      if (!user) {
        // no user found - err
        return done(new Error("Invalid credentials"), null);
      }

      // Comparing hashed values of PWs
      const isPasswordCorrect = await argon2.verify(user.password, password);

      if (!isPasswordCorrect) {
        // user found but password doesn't match - throw err
        return done(new Error("Invalid credentials"), null);
      }
      // if both cases are false - call done function
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);
