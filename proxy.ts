import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && !token.error) {
    return NextResponse.next();
  }

  const login = new URL("/auth/login", request.url);
  login.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!api/auth(?:/|$)|auth/login(?:/|$)|uk(?:/|$)|_next/|assets/|favicon.ico|vercel.svg).*)",
  ],
};
