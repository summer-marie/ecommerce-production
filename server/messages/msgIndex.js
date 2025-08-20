import express from "express";
import messageCreate from "./msgCreate.js";
import messageGetAll from "./msgGetAll.js";
import messageUpdateRead from "./msgUpdateRead.js";
import messageDelete from "./msgDelete.js";
import messageStats from "./msgStats.js";
import { contactRateLimit, adminRateLimit } from "../middleware/advancedSecurity.js";

const msgIndex = express.Router();

// Create/Add - PUBLIC (contact form) - strict rate limit
msgIndex.post("/", contactRateLimit, messageCreate);

// Admin operations - less restrictive rate limit
msgIndex.get("/", adminRateLimit, messageGetAll);
msgIndex.get("/stats", adminRateLimit, messageStats);
msgIndex.put("/:id", adminRateLimit, messageUpdateRead);
msgIndex.delete("/:id", adminRateLimit, messageDelete);

export default msgIndex;
