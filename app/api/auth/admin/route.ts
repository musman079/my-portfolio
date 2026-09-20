import { NextResponse } from "next/server";
import { signAdminToken, requireAdminAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || "Usman123@@@";

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password === expectedPassword) {
      const token = signAdminToken();

      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
        token,
        user: "Admin",
      });

      // Set secure session cookie
      response.cookies.set("admin_session", token, {
        httpOnly: true,
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
  const isAuth = requireAdminAuth(req);
  return NextResponse.json({
    authenticated: isAuth,
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
