import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { isMaintenanceEnabled } from "@/lib/maintenance-edge";

const MAINTENANCE_PATH = "/maintenance";
const INVITATION_PATH = "/invitation";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (pathname === "/login") {
    // The admin layout sends deleted accounts here with "session=expired": their cookie is
    // still signed, so redirecting it back to /admin would loop.
    const sessionExpired = request.nextUrl.searchParams.get("session") === "expired";
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token && !sessionExpired ? await verifySessionToken(token) : null;
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Invitation links must keep working during maintenance, and the token in the URL
  // must never leak through the Referer header.
  if (pathname === INVITATION_PATH) {
    const response = NextResponse.next();
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }

  const maintenanceEnabled = await isMaintenanceEnabled();

  // The maintenance page is only reachable directly while maintenance is on.
  if (pathname === MAINTENANCE_PATH) {
    return maintenanceEnabled
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }

  // Public site: during maintenance, visitors get the maintenance page at the same URL,
  // while a logged-in admin keeps seeing the real site.
  if (maintenanceEnabled) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      const response = NextResponse.rewrite(new URL(MAINTENANCE_PATH, request.url), {
        status: 503,
      });
      response.headers.set("Cache-Control", "no-store");
      response.headers.set("Retry-After", "3600");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes (including /api/auth/*), Next.js assets and
  // files with an extension (images, robots.txt, sitemap.xml, icons).
  matcher: ["/((?!api/|_next/static|_next/image|.*\\..*).*)"],
};
