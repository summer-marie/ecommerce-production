import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import adminModel from '../admins/adminModel.js'

const jwtSecret = process.env.JWT_SECRET

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await adminModel.findOne({ _id: jwtPayload._id })
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done(err, null)
    }
  })
)
