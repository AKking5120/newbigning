import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Admin emails whitelist
const ADMIN_EMAILS = [
  "omdas@radhaji.com",
  "solankipratham001@gmail.com",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is admin (by email whitelist OR role in DB)
  const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");

  if (!isAdmin) {
    // Not admin → redirect to home with error
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
