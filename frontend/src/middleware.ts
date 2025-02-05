import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string;
    roles: string[];
    exp: number;
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1] || request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    if (pathname.startsWith("/super-admin") && !decoded.roles.includes("SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-roles", decoded.roles.join(","));
    requestHeaders.set("x-user-email", decoded.sub);

    return NextResponse.next({
      headers: requestHeaders
    });

  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: [
    "/super-admin/:path",
    "/dashboard/:path",
    "/questions/:path",
    "/answers/:path",
  ],
};
