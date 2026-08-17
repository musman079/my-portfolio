import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: { type: String, default: "Full-Stack MERN" },
  description: { type: String, required: true },
  tech: { type: [String], required: true },
  github: { type: String, default: "" },
  live: { type: String, default: "" },
  accentColor: { type: String, required: true },
  details: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export const Project = models.Project || model("Project", ProjectSchema);
