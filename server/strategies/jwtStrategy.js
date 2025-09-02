import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../admins/adminModel.js";
import crypto from "crypto";

const jwtSecret = process.env.JWT_SECRET || "secret";
const jwtSecretFp = crypto
  .createHash("sha256")
  .update(String(jwtSecret))
  .digest("hex")
  .slice(0, 12);
// Log at initialization so we can compare even if verification fails pre-callback
// JWT Strategy initialized
// JWT strategy options with multiple extractors (Authorization header or cookie)
const cookieExtractor = (req) =>
  (req?.signedCookies && req.signedCookies.token) ||
  (req?.cookies && req.cookies.token) ||
  null;

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  secretOrKey: jwtSecret,
  passReqToCallback: true,
};
// For authenticated users
passport.use(
  new JwtStrategy(opts, async (req, jwtPayload, done) => {
    try {
  // JWT payload received
      const user = await userModel.findOne({ _id: jwtPayload._id });
      if (!user) {
  // User not found for token subject
        return done(null, false);
      }

  // User found
      // For now, accept any valid JWT - we'll add whitelist enforcement later
      return done(null, user);
    } catch (err) {
  // JWT verification error
      return done(err, null);
    }
  })
);
