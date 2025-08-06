import { Router } from 'express'
import passport from 'passport'
import authLogin from './authLogin.js'
import authStatus from './authStatus.js'
import authLogout from './authLogout.js'

const authRouter = Router()


authRouter.post('/login', passport.authenticate('local'), authLogin)

authRouter.get(
  '/status',
  passport.authenticate('jwt', { session: false }),
  authStatus
)

authRouter.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  authLogout
)


export default authRouter
