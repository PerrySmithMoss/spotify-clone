import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: any) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname, origin } = req.nextUrl;
  // Allow the requests if the following are true
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login page if they don't have token AND are requesting aprotected route
  if (!token && pathname !== "/auth/login") {
    return NextResponse.rewrite(`${origin}/auth/login`);
  }
}
