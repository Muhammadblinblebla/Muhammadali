import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lightweight auth gate: ensure auth cookie exists for protected routes.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = pathname.startsWith("/worker") || pathname.startsWith("/client") || pathname.startsWith("/chat")

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth_token")?.value
  if (!token) {
    const url = new URL("/auth", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
