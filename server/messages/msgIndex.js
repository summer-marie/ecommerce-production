import express from "express";
import messageCreate from "./msgCreate.js";
import messageGetAll from "./msgGetAll.js";
import messageUpdateRead from "./msgUpdateRead.js";
import messageDelete from "./msgDelete.js";

const msgIndex = express.Router();

// Create/Add
msgIndex.post("/", messageCreate);

// getAll, no validation
msgIndex.get("/", messageGetAll);

// find/Update One
msgIndex.put("/:id", messageUpdateRead);

// Delete One
msgIndex.delete("/:id", messageDelete);

export default msgIndex;
