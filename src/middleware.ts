import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionToken?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/", "/habits", "/statistics", "/calendar"];

  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && protectedRoutes.some((route) => pathname === route || pathname.startsWith("/habits"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/habits/:path*", "/statistics", "/calendar"],
};
