import mongoose, { Schema, model, models } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global_stats" },
    pageViews: { type: Number, default: 0 },
    cliLaunches: { type: Number, default: 0 },
    estimatorCalculations: { type: Number, default: 0 },
    resumeDownloads: { type: Number, default: 0 },
    contactInquiries: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Analytics = models.Analytics || model("Analytics", AnalyticsSchema);
