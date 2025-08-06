import express from "express";
import ingredientsCreate from "./ingredientsCreate.js";
import ingredientsGetAll from "./ingredientsGetAll.js";
import findOneAndUpdate from "./findOneAndUpdate.js";
import ingredientGetOne from "./ingredientsGetOne.js";
import ingredientsDeleteOne from "./ingredientsDeleteOne.js";

const ingredientsIndex = express.Router();

// Create/Add
ingredientsIndex.post("/", ingredientsCreate);

// getAll
ingredientsIndex.get("/", ingredientsGetAll);

// Get One
ingredientsIndex.get("/:id", ingredientGetOne);

// find/Update One
ingredientsIndex.put("/:id", findOneAndUpdate);

// Delete One
ingredientsIndex.delete("/:id", ingredientsDeleteOne);

export default ingredientsIndex;
