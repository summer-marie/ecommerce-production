import { Router } from "express";
import passport from "passport";
import OperatingHours, { getOrCreateOperatingDoc } from "./operatingModel.js"; // is this syntax correct ?
import { computeOpenStatus } from "./operatingUtils.js";

const router = Router();

// Admin: get full config
router.get(
  "/",
  (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user)
        return res.status(401).json({ success: false, message: "Unauthorized" });
      req.user = user;
      next();
    })(req, res, next),
  async (req, res) => {
    try {
      const doc = await getOrCreateOperatingDoc();
      const status = computeOpenStatus(doc);
      res.json({ success: true, config: doc.toJSON(), status });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
);

// Public: get current operating status and config needed for UI
router.get("/status", async (req, res) => {
  try {
    const doc = await getOrCreateOperatingDoc();
    const status = computeOpenStatus(doc);
    res.json({
      success: true,
      status: {
        isOpen: status.isOpen,
        reason: status.reason,
        timezone: doc.timezone,
  devForceOpen: !!doc.devForceOpen,
  adminAlertEmails: doc.adminAlertEmails || [],
        bannerMessageClosed: doc.bannerMessageClosed,
        bannerMessageOpen: doc.bannerMessageOpen,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Admin: update operating hours/settings
router.put(
  "/",
  (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user) return res.status(401).json({ success: false, message: "Unauthorized" });
      req.user = user;
      next();
    })(req, res, next),
  async (req, res) => {
    try {
      const payload = req.body || {};
      const doc = await getOrCreateOperatingDoc();

      const fields = [
        "timezone",
        "devForceOpen",
        "forceClosed",
        "adminAlertEmails",
        "bannerMessageClosed",
        "bannerMessageOpen",
        "weeklyHours",
        "specialOpenWindows",
      ];
      for (const f of fields) if (payload[f] !== undefined) doc[f] = payload[f];
      doc.updatedAt = new Date();
      await doc.save();

      const status = computeOpenStatus(doc);
      res.json({ success: true, config: doc.toJSON(), status });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
);

export default router;
