import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/auth";
import { Service } from "@/models/Service";

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find({}).sort({ createdAt: -1 });
    const mapped = services.map((s) => ({ ...s.toObject(), id: s._id.toString() }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const data = await req.json();
    const service = await Service.create(data);
    return NextResponse.json({ ...service.toObject(), id: service._id.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
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

    const updated = await Service.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    return NextResponse.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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

    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
