import { Router } from "express";
import passport from "passport";
import adminCreate from "./adminCreate.js";
// import { requireApiKey } from '../middleware/apiKeyAuth.js'

const adminRouter = Router();

// Temporarily allow admin creation without API key for initial setup
adminRouter.post("/", adminCreate);

// TODO: Re-enable API key protection after initial admin setup
// adminRouter.post('/', requireApiKey(['admin']), adminCreate)

export default adminRouter;
