import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/auth";
import { Review } from "@/models/Review";

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    const mapped = reviews.map((r) => ({ ...r.toObject(), id: r._id.toString() }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const data = await req.json();
    const review = await Review.create(data);
    return NextResponse.json({ ...review.toObject(), id: review._id.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
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

    const updated = await Review.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
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

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
