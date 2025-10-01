import builderModel from "./builderModel.js";
import { getLog } from "../utils/logger.js";

const builderCreate = async (req, res) => {
  try {
  const log = getLog(req, { event: 'builder.create' });
  log.debug({ bodyKeys: Object.keys(req.body || {}) }, 'create builder request body');

    const { pizzaName, base, sauce, meatTopping, veggieTopping, herbs, otherAdditions, image } =
      req.body;

    // Validation
    if (!pizzaName || pizzaName === "") {
      return res
        .status(400)
        .json({ success: false, message: "Pizza name is required" });
    }

    // Accept admin-provided price instead of calculating from ingredients
    const rawPrice = req.body.pizzaPrice;
    const pizzaPrice =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
    if (!Number.isFinite(pizzaPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid pizzaPrice is required" });
    }
    if (pizzaPrice < 0 || pizzaPrice > 1000) {
      return res.status(400).json({
        success: false,
        message: "pizzaPrice must be between 0 and 1000",
      });
    }

    const newPizza = await builderModel.create({
      pizzaName,
      pizzaPrice, // Use admin-entered price
  base,
  sauce,
  meatTopping,
  veggieTopping,
  herbs: Array.isArray(herbs) ? herbs : [],
  otherAdditions: Array.isArray(otherAdditions) ? otherAdditions : [],
      image: image || null, // Firebase Storage image data
    });

    log.info({
      id: newPizza._id,
      pizzaName: newPizza.pizzaName,
      price: newPizza.pizzaPrice,
      hasImage: !!newPizza.image,
      imageMeta: newPizza.image
        ? {
            filename: newPizza.image.filename,
            mimetype: newPizza.image.mimetype,
            dataSize: newPizza.image.data
              ? `${(newPizza.image.data.length / 1024).toFixed(2)} KB`
              : '0 KB'
          }
        : null
    }, 'builder created');

    res.status(200).json({
      success: true,
      message: "Pizza created successfully",
      pizza: newPizza,
    });
  } catch (err) {
  const log = getLog(req, { event: 'builder.create.error' });
  log.error({ err: err?.message }, 'builder create error');
    res.status(500).json({
      success: false,
      message: "Server error while creating pizza",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default builderCreate;
