import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/auth";
import { Skill } from "@/models/Skill";

export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find({}).sort({ createdAt: -1 });
    const mapped = skills.map((s) => ({ ...s.toObject(), id: s._id.toString() }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const data = await req.json();
    const skill = await Skill.create(data);
    return NextResponse.json({ ...skill.toObject(), id: skill._id.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const data = await req.json();
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await Skill.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
