import express from "express";
import menuItemCreate from "./menuItemCreate.js";
import menuItemGetAll from "./menuItemGetAll.js";
import menuItemGetOne from "./menuItemGetOne.js";
import menuItemUpdateOne from "./menuItemUpdateOne.js";
import menuItemDeleteOne from "./menuItemDeleteOne.js";
import { adminRateLimit } from "../middleware/advancedSecurity.js";

const router = express.Router();

// Public routes (for customer menu viewing)
router.get("/", menuItemGetAll);
router.get("/:id", menuItemGetOne);

// Admin routes (auth handled at layout level)
router.post("/", adminRateLimit, menuItemCreate);
router.put("/:id", adminRateLimit, menuItemUpdateOne);
router.delete("/:id", adminRateLimit, menuItemDeleteOne);

export default router;