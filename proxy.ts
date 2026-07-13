import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "princekumardas5120@gmail.com").split(",");
//const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "solankipratham001@gmail.com").split(",");

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /profile
  if (pathname.startsWith("/profile") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/admin", request.url));
    }
    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
