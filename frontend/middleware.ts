import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "./lib/auth"


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const currentUser = await getCurrentUser(request)
  const isLoggedIn = !!currentUser

  // Define path patterns that require authentication
  const authRequiredPaths = [
    // "/dashboard",
    // "/dashboard/classes",
    // "/dashboard/wallet",
    // "/dashboard/profile",
    // "/dashboard/settings",
  ]

  // Define admin-only paths
  const adminOnlyPaths = [
    // "/dashboard/users",
    //  "/dashboard/admin"
    ]

  // Define teacher-only paths
  const teacherOnlyPaths = [
    // "/dashboard/classes/create",
    //  "/dashboard/classes/*/attendance"
    ]

  const url = request.nextUrl.clone()
  const { pathname } = url

  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path is admin-only
  const isAdminOnly = adminOnlyPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path is teacher-only
  const isTeacherOnly = teacherOnlyPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // If the path requires authentication and the user is not logged in, redirect to login
  if (isAuthRequired && !isLoggedIn) {
    url.pathname = "/login"
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If the user is logged in, get their role from the cookie
  let userRole = ""
  if (isLoggedIn) {
    try {
      const userData = currentUser
      userRole = userData.role
    } catch (e) {
      // If parsing fails, assume no role
      userRole = ""
    }
  }

  // If the path is admin-only and the user is not an admin, redirect to dashboard
  if (isAdminOnly && userRole !== "admin") {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // If the path is teacher-only and the user is not a teacher or admin, redirect to dashboard
  if (isTeacherOnly && userRole !== "teacher" && userRole !== "admin") {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

