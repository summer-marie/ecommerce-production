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
    // Backward compatibility: prefer legacy fields when new ones are empty/defaults
    const defaults = {
      topHeading: "From Hearth to Table: Freshness & Flavor That Set Us Apart",
      centerHeading: "Our Purpose",
      bottomHeading: "Boston-Bred Classics: Savoring Neighbors Close by",
    };

    const hasData = (img) =>
      !!(img && typeof img === "object" && img.data && img.data.trim());
    const str = (v) => (typeof v === "string" ? v.trim() : "");

    // Images: only remap when current image has no data but legacy exists
    if (!hasData(json.topImage) && hasData(json.gardenImage))
      json.topImage = json.gardenImage;
    if (!hasData(json.centerImage) && hasData(json.doughImage))
      json.centerImage = json.doughImage;
    if (!hasData(json.bottomImage) && hasData(json.herbsImage))
      json.bottomImage = json.herbsImage;

    // Headings: if current equals default (or empty) and legacy exists, prefer legacy
    if (
      (str(json.topHeading) === "" ||
        str(json.topHeading) === defaults.topHeading) &&
      str(json.ingredientsHeading)
    ) {
      json.topHeading = json.ingredientsHeading;
    }
    if (
      (str(json.centerHeading) === "" ||
        str(json.centerHeading) === defaults.centerHeading) &&
      str(json.purposeHeading)
    ) {
      json.centerHeading = json.purposeHeading;
    }
    if (
      (str(json.bottomHeading) === "" ||
        str(json.bottomHeading) === defaults.bottomHeading) &&
      str(json.missionHeading)
    ) {
      json.bottomHeading = json.missionHeading;
    }

    // Descriptions: map when empty and legacy exists
    if (!str(json.topDescription) && str(json.ourIngredients))
      json.topDescription = json.ourIngredients;
    if (!str(json.centerDescription) && str(json.ourPurpose))
      json.centerDescription = json.ourPurpose;
    if (!str(json.bottomDescription) && str(json.ourMissionStatement))
      json.bottomDescription = json.ourMissionStatement;
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
    if (payload.gardenImage && !payload.topImage)
      payload.topImage = payload.gardenImage;
    if (payload.doughImage && !payload.centerImage)
      payload.centerImage = payload.doughImage;
    if (payload.herbsImage && !payload.bottomImage)
      payload.bottomImage = payload.herbsImage;
    if (payload.ingredientsHeading && !payload.topHeading)
      payload.topHeading = payload.ingredientsHeading;
    if (payload.purposeHeading && !payload.centerHeading)
      payload.centerHeading = payload.purposeHeading;
    if (payload.missionHeading && !payload.bottomHeading)
      payload.bottomHeading = payload.missionHeading;
    if (payload.ourIngredients && !payload.topDescription)
      payload.topDescription = payload.ourIngredients;
    if (payload.ourPurpose && !payload.centerDescription)
      payload.centerDescription = payload.ourPurpose;
    if (payload.ourMissionStatement && !payload.bottomDescription)
      payload.bottomDescription = payload.ourMissionStatement;
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
