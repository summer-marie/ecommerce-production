import { getOrCreateOperatingDoc } from "../operatingHours/operatingModel.js";
import { computeOpenStatus } from "../operatingHours/operatingUtils.js";

export async function requireOpenForOrdering(req, res, next) {
  try {
    const doc = await getOrCreateOperatingDoc();
    const status = computeOpenStatus(doc);
    if (!status.isOpen) {
      return res.status(403).json({
        success: false,
        message:
          doc.bannerMessageClosed || "We're closed right now and not accepting orders.",
        reason: status.reason,
      });
    }
    return next();
  } catch (e) {
    // Fail-safe: if configuration breaks, allow orders to avoid hard outage
    return next();
  }
}
