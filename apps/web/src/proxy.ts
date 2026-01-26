import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

const protectedRoutes = ["/admin", "/blog/categories/processes"];
export default async function proxy(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !session) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}
