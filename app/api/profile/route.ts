import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Profile } from "@/models/Profile";

const DEFAULT_PROFILE = {
  avatarUrl: "/placeholder.jpg",
  name: "Muhammad Usman",
  title: "Full-Stack Developer",
  bio: "Dedicated Full-Stack Developer with a focus on the MERN stack — MongoDB, Express.js, React, and Node.js.",
  resumeUrl: "https://drive.google.com/file/d/1L8iT_FWQeu5zaE9CWjt7kEoik7iMzb51/view?usp=sharing",
  available: true,
};

export async function GET() {
  try {
    await connectToDatabase();
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(DEFAULT_PROFILE);
    }
    return NextResponse.json({ ...profile.toObject(), id: profile._id.toString() });
  } catch (error) {
    return NextResponse.json(DEFAULT_PROFILE);
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    } else {
      profile = await Profile.create(data);
    }
    return NextResponse.json({ ...profile.toObject(), id: profile._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
