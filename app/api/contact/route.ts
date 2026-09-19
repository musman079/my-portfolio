import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/auth";
import { Inquiry } from "@/models/Inquiry";
import { Analytics } from "@/models/Analytics";

// Simple in-memory IP rate limiter: max 5 requests per 10 minutes
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  if (entry.count >= 5) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean up stale IP records every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRateMap.entries()) {
    if (now > entry.resetAt) {
      ipRateMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

// Optional webhook notification (Discord / Telegram / Slack / Zapier)
async function sendNotificationWebhook(inquiry: {
  name: string;
  email: string;
  projectType: string;
  message: string;
  estimatedBudget?: string;
}) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const payload = {
      content: `🔥 **New Portfolio Inquiry Received!**\n**From:** ${inquiry.name} (${inquiry.email})\n**Project Type:** ${inquiry.projectType}\n**Budget:** ${inquiry.estimatedBudget || "Not specified"}\n**Message:**\n${inquiry.message}`,
      embeds: [
        {
          title: "New Lead Inquiry",
          color: 0xf59e0b,
          fields: [
            { name: "Client", value: inquiry.name, inline: true },
            { name: "Email", value: inquiry.email, inline: true },
            { name: "Project", value: inquiry.projectType, inline: true },
            { name: "Budget", value: inquiry.estimatedBudget || "Not specified", inline: true },
            { name: "Message", value: inquiry.message },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Webhook dispatch failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    // Determine client IP for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes or reach out via WhatsApp directly." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, projectType, message, estimatedBudget, website_hp } = body;

    // Honeypot anti-spam check: if hidden honeypot field is filled, silently discard
    if (website_hp) {
      return NextResponse.json(
        { success: true, message: "Your message has been received!" },
        { status: 200 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const inquiry = await Inquiry.create({
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 120),
      projectType: (projectType || "Full-Stack MERN App").trim().slice(0, 100),
      message: message.trim().slice(0, 3000),
      estimatedBudget: (estimatedBudget || "").trim().slice(0, 50),
      status: "unread",
    });

    // Increment inquiry count in analytics
    try {
      await Analytics.findOneAndUpdate(
        { key: "global_stats" },
        { $inc: { contactInquiries: 1 }, $set: { lastUpdated: new Date() } },
        { upsert: true }
      );
    } catch (_) {}

    // Dispatch webhook alert asynchronously
    sendNotificationWebhook({
      name,
      email,
      projectType,
      message,
      estimatedBudget,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received! Usman will get back to you shortly.",
        inquiryId: inquiry._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please reach out directly via WhatsApp or email." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required to view inquiries." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Inquiry ID and new status are required" },
        { status: 400 }
      );
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
