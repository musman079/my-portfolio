import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password === expectedPassword) {
      // In a serverless setup, return authorized token and status
      const authPayload = {
        authenticated: true,
        user: "Admin",
        timestamp: Date.now(),
        // Simple hash token for client session check
        token: Buffer.from(`admin_${Date.now()}_auth`).toString("base64"),
      };

      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
        ...authPayload,
      });

      // Set session cookie
      response.cookies.set("admin_session", authPayload.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid password. Access denied." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication service error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const hasSession = cookie.includes("admin_session=");

  return NextResponse.json({
    authenticated: hasSession,
  });
}
