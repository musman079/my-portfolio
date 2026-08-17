import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Profile } from "@/models/Profile";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

export async function GET() {
  try {
    await connectToDatabase();
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(DEFAULT_SITE_CONFIG);
    }
    return NextResponse.json({ ...DEFAULT_SITE_CONFIG, ...profile.toObject(), id: profile._id.toString() });
  } catch (error) {
    return NextResponse.json(DEFAULT_SITE_CONFIG);
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
    return NextResponse.json({ ...DEFAULT_SITE_CONFIG, ...profile.toObject(), id: profile._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update site configuration" }, { status: 500 });
  }
}
