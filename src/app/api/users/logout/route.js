import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Clear the auth cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // expires immediately
    path: "/",
  });

  return response;
}
