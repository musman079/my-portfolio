import mongoose, { Schema, model, models } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    projectType: { type: String, default: "Full-Stack MERN App" },
    message: { type: String, required: true },
    estimatedBudget: { type: String, default: "" },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
