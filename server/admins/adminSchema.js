import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  token: {
    type: String,
    default: "",
  },
});

const adminSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
  role: {
    type: String,
    enum: ["admin", "manager"],
    default: "admin",
  },

  authStrategy: {
    type: String,
    default: "local",
  },
  token: {
    type: [sessionSchema],
  },
});

export default adminSchema;
