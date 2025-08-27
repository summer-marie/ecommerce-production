import { Router } from "express";
import aboutModel from "./aboutModel.js";

const router = Router();

// Helper: ensure one singleton document exists
async function getOrCreateAbout() {
  let doc = await aboutModel.findOne();
  if (!doc) {
    doc = await aboutModel.create({});
  }
  return doc;
}

// Public: get About content
router.get("/", async (req, res) => {
  try {
  const doc = await getOrCreateAbout();
  const json = doc.toJSON();
  // Backward compatibility: if old keys exist in DB, map them to new ones
  if (!json.topImage && json.gardenImage) json.topImage = json.gardenImage;
  if (!json.centerImage && json.doughImage) json.centerImage = json.doughImage;
  if (!json.bottomImage && json.herbsImage) json.bottomImage = json.herbsImage;
  // Map old specific fields to new universal ones
  if (!json.topHeading && json.ingredientsHeading) json.topHeading = json.ingredientsHeading;
  if (!json.centerHeading && json.purposeHeading) json.centerHeading = json.purposeHeading;
  if (!json.bottomHeading && json.missionHeading) json.bottomHeading = json.missionHeading;
  if (!json.topDescription && json.ourIngredients) json.topDescription = json.ourIngredients;
  if (!json.centerDescription && json.ourPurpose) json.centerDescription = json.ourPurpose;
  if (!json.bottomDescription && json.ourMissionStatement) json.bottomDescription = json.ourMissionStatement;
  res.json({ success: true, about: json });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update About content (no auth checks)
router.put("/", async (req, res) => {
  try {
    const payload = req.body || {};
    // Map legacy keys to new ones if provided
    if (payload.gardenImage && !payload.topImage) payload.topImage = payload.gardenImage;
    if (payload.doughImage && !payload.centerImage) payload.centerImage = payload.doughImage;
    if (payload.herbsImage && !payload.bottomImage) payload.bottomImage = payload.herbsImage;
    if (payload.ingredientsHeading && !payload.topHeading) payload.topHeading = payload.ingredientsHeading;
    if (payload.purposeHeading && !payload.centerHeading) payload.centerHeading = payload.purposeHeading;
    if (payload.missionHeading && !payload.bottomHeading) payload.bottomHeading = payload.missionHeading;
    if (payload.ourIngredients && !payload.topDescription) payload.topDescription = payload.ourIngredients;
    if (payload.ourPurpose && !payload.centerDescription) payload.centerDescription = payload.ourPurpose;
    if (payload.ourMissionStatement && !payload.bottomDescription) payload.bottomDescription = payload.ourMissionStatement;
    const doc = await getOrCreateAbout();

    // Assign only allowed fields
  const fields = [
      "topHeading",
      "topDescription",
      "centerHeading",
      "centerDescription",
      "bottomHeading",
      "bottomDescription",
      "topImage",
      "centerImage",
      "bottomImage",
    ];
    for (const f of fields) {
      if (payload[f] !== undefined) doc[f] = payload[f];
    }
    await doc.save();
    const json = doc.toJSON();
    res.json({ success: true, about: json });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;