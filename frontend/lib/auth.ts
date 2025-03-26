import { cookies } from "next/headers"

export type UserRole = "student" | "teacher" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

// This is a mock function for demonstration purposes
// In a real app, you would verify the session token with your auth provider
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("currentUser")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value) as User
  } catch (error) {
    return null
  }
}

// Helper function to check if a user has a specific role
export function hasRole(user: User | null, roles: UserRole | UserRole[]): boolean {
  if (!user) return false

  if (Array.isArray(roles)) {
    return roles.includes(user.role)
  }

  return user.role === roles
}

// Example of a server component that redirects if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    // This should be handled by middleware, but as a fallback
    redirect("/login")
  }

  return user
}

// Example of a server component that redirects if not authorized for a role
export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await requireAuth()

  if (!hasRole(user, roles)) {
    // Redirect to dashboard if the user doesn't have the required role
    redirect("/dashboard")
  }

  return user
}

// Helper function for redirects
function redirect(path: string) {
  // In a server component, you would use the redirect function from next/navigation
  // This is a simplified version
  throw new Error(`Redirect to ${path}`)
}

