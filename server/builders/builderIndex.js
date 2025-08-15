import express from "express";
import builderCreate from "./builderCreate.js";
import builderGetMany from "./builderGetMany.js";
import pizzaUpdateOne from "./builderUpdateOne.js";
import builderGetOne from "./builderGetOne.js";
import builderDeleteOne from "./builderDeleteOne.js";

const builderIndex = express.Router();

// Create
builderIndex.post("/", builderCreate);

// Get all
builderIndex.get("/", builderGetMany);

// Update one
builderIndex.put("/:id", pizzaUpdateOne);

// Get One
builderIndex.get("/pizza-detail/:id", builderGetOne);

// Delete One
builderIndex.delete("/:id", builderDeleteOne);

export default builderIndex;
