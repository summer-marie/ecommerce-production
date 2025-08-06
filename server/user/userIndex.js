import { Router } from 'express'
import passport from "passport"
import userCreate from './userCreate.js'

const userRouter = Router()

userRouter.post('/', userCreate)

export default userRouter



// passport.authenticate("jwt", { session: false })