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
    res.json({ success: true, about: json });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update About content (no auth checks)
router.put("/", async (req, res) => {
  try {
    const payload = req.body || {};
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
