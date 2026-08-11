import mongoose, { Schema, model, models } from "mongoose";

const SkillSchema = new Schema({
  category: { type: String, required: true },
  items: { type: [String], required: true },
  color: { type: String, required: true },
  level: { type: Number, required: true },
}, { timestamps: true });

export const Skill = models.Skill || model("Skill", SkillSchema);
