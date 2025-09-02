import { Router } from "express";
import passport from "passport";
import adminCreate from "./adminCreate.js";
// import { requireApiKey } from '../middleware/apiKeyAuth.js'

const adminRouter = Router();

// Optional JWT population: lets us access req.user if a valid token is present
const maybeJwt = (req, res, next) =>
	passport.authenticate("jwt", { session: false }, (err, user) => {
		if (user) req.user = user;
		return next();
	})(req, res, next);

// Allow bootstrap creation without auth up to a limit; beyond that adminCreate enforces admin-only
adminRouter.post("/", maybeJwt, adminCreate);

// After initial setup, consider enforcing strict protection:
// adminRouter.post('/', requireApiKey('admin'), passport.authenticate('jwt', { session: false }), adminCreate)

export default adminRouter;
