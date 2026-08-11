import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  date: { type: String, required: true },
  project: { type: String, required: true },
}, { timestamps: true });

export const Review = models.Review || model("Review", ReviewSchema);
