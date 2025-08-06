import express from "express"
import orderCreate from "./orderCreate.js"
import orderGetAll from "./orderGetAll.js"
import orderArchiveOne from "./orderArchiveOne.js"
import orderGetOne from "./orderGetOne.js"
import orderGetArchived from "./orderGetArchived.js"
import orderGetOpen from "./orderGetOpen.js"
import orderUpdateStatus from "./orderUpdateStatus.js"

const orderIndex = express.Router()

// Create API
orderIndex.post("/", orderCreate)

// Get all, no validation
orderIndex.get("/", orderGetAll)

// Archive order
orderIndex.put("/archive/:id", orderArchiveOne)

// Get all archived orders
orderIndex.get("/archived", orderGetArchived)

// Get all open orders
orderIndex.get("/open", orderGetOpen)

// Get all open orders
orderIndex.put("/open/:id", orderUpdateStatus)

// Get one order by id
orderIndex.get("/order/:id", orderGetOne)

export default orderIndex

// Get orders by validated email
// orderIndex.get("/:email", orderGetMany)
