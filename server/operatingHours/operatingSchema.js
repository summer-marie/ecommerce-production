import mongoose from "mongoose";

const timeRangeSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    note: { type: String },
  },
  { _id: false }
);

const dailyWindowSchema = new mongoose.Schema(
  {
    start: { type: String, required: true }, // "HH:mm" in business timezone
    end: { type: String, required: true },
  },
  { _id: false }
);

const weeklyHoursSchema = new mongoose.Schema(
  {
    sun: { type: [dailyWindowSchema], default: [] },
    mon: { type: [dailyWindowSchema], default: [] },
    tue: { type: [dailyWindowSchema], default: [] },
    wed: { type: [dailyWindowSchema], default: [] },
    thu: { type: [dailyWindowSchema], default: [] },
    fri: { type: [dailyWindowSchema], default: [] },
    sat: { type: [dailyWindowSchema], default: [] },
  },
  { _id: false }
);

const operatingSchema = new mongoose.Schema(
  {
    timezone: { type: String, default: "UTC" },
  // Developer override: force site to accept orders regardless of hours
  devForceOpen: { type: Boolean, default: false },
    forceClosed: { type: Boolean, default: false },
  // Admin alert recipients (one or more emails)
  adminAlertEmails: { type: [String], default: [] },
    bannerMessageClosed: {
      type: String,
      default: "We're closed right now. Please check back soon.",
    },
    bannerMessageOpen: {
      type: String,
      default: "We're open and accepting orders!",
    },
    weeklyHours: { type: weeklyHoursSchema, default: () => ({}) },
    specialOpenWindows: { type: [timeRangeSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "operating_hours" }
);

export default operatingSchema;
