import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: [String], required: true },
  color: { type: String, required: true },
}, { timestamps: true });

export const Service = models.Service || model("Service", ServiceSchema);
