import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema({
  avatarUrl: { type: String, default: "/placeholder.jpg" },
  name: { type: String, default: "Muhammad Usman" },
  title: { type: String, default: "Full-Stack Developer" },
  bio: { type: String, default: "Dedicated Full-Stack Developer with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js." },
  resumeUrl: { type: String, default: "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing" },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export const Profile = models.Profile || model("Profile", ProfileSchema);
