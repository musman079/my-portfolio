import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Service } from "@/models/Service";
import { Review } from "@/models/Review";
import { Profile } from "@/models/Profile";
import {
  DEFAULT_SITE_CONFIG,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_SERVICES,
  DEFAULT_REVIEWS,
} from "@/lib/site-config";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const action = body.action || "seed";

    if (action === "clear-reviews") {
      await Review.deleteMany({});
      return NextResponse.json({ success: true, message: "All reviews cleared from database" });
    }

    if (action === "reset-all") {
      await Promise.all([
        Project.deleteMany({}),
        Skill.deleteMany({}),
        Service.deleteMany({}),
        Review.deleteMany({}),
        Profile.deleteMany({}),
      ]);
    }

    // Seed Profile if none exists
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create(DEFAULT_SITE_CONFIG);
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(
        DEFAULT_PROJECTS.map(({ id, ...p }) => p)
      );
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(
        DEFAULT_SKILLS.map(({ id, ...s }) => s)
      );
    }

    // Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(
        DEFAULT_SERVICES.map(({ id, ...svc }) => svc)
      );
    }

    // Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany(
        DEFAULT_REVIEWS.map(({ id, ...r }) => r)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded with initial default data successfully!",
      seeded: {
        projects: await Project.countDocuments(),
        skills: await Skill.countDocuments(),
        services: await Service.countDocuments(),
        reviews: await Review.countDocuments(),
        profile: await Profile.countDocuments(),
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database. Check MongoDB connection." },
      { status: 500 }
    );
  }
}
