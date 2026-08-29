import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Analytics } from "@/models/Analytics";
import { Inquiry } from "@/models/Inquiry";
import { Project } from "@/models/Project";
import { Review } from "@/models/Review";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { event } = body;

    const updateQuery: Record<string, number> = {};

    if (event === "pageView") updateQuery.pageViews = 1;
    else if (event === "cliLaunch") updateQuery.cliLaunches = 1;
    else if (event === "estimatorCalculation") updateQuery.estimatorCalculations = 1;
    else if (event === "resumeDownload") updateQuery.resumeDownloads = 1;
    else {
      updateQuery.pageViews = 1;
    }

    const updated = await Analytics.findOneAndUpdate(
      { key: "global_stats" },
      {
        $inc: updateQuery,
        $set: { lastUpdated: new Date() },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, stats: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Analytics logging failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    let stats = await Analytics.findOne({ key: "global_stats" }).lean();
    if (!stats) {
      stats = await Analytics.create({
        key: "global_stats",
        pageViews: 1,
        cliLaunches: 0,
        estimatorCalculations: 0,
        resumeDownloads: 0,
        contactInquiries: 0,
      });
    }

    const unreadInquiries = await Inquiry.countDocuments({ status: "unread" });
    const totalInquiries = await Inquiry.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalReviews = await Review.countDocuments();

    return NextResponse.json({
      ...stats,
      unreadInquiries,
      totalInquiries,
      totalProjects,
      totalReviews,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
