import express from "express"
import orderCreate from "./orderCreate.js"
import orderGetAll from "./orderGetAll.js"
import orderArchiveOne from "./orderArchiveOne.js"
import orderGetOne from "./orderGetOne.js"
import orderGetArchived from "./orderGetArchived.js"
import orderGetOpen from "./orderGetOpen.js"
import orderUpdateStatus from "./orderUpdateStatus.js"
import { orderRateLimit } from "../middleware/advancedSecurity.js"

const orderIndex = express.Router()

// Create API - Rate limited (prevents spam orders)
orderIndex.post("/", orderRateLimit, orderCreate)

// Get all, no validation - No rate limit (admin viewing)
orderIndex.get("/", orderGetAll)

// Archive order - Rate limited (prevents abuse)
orderIndex.put("/archive/:id", orderRateLimit, orderArchiveOne)

// Get all archived orders - No rate limit (admin viewing)
orderIndex.get("/archived", orderGetArchived)

// Get all open orders - No rate limit (admin viewing)
orderIndex.get("/open", orderGetOpen)

// Update order status - Rate limited (prevents abuse)
orderIndex.put("/open/:id", orderRateLimit, orderUpdateStatus)

// Get one order by id - No rate limit (admin viewing)
orderIndex.get("/order/:id", orderGetOne)

export default orderIndex

// Get orders by validated email
// orderIndex.get("/:email", orderGetMany)
