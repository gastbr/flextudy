"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User } from "@/lib/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard"

  // In a real app, you would validate credentials against your auth provider
  // This is a mock implementation for demonstration

  // Mock users for different roles
  const mockUsers: Record<string, User> = {
    "admin@example.com": {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      avatar: "/placeholder.svg",
    },
    "teacher@example.com": {
      id: "2",
      name: "Teacher User",
      email: "teacher@example.com",
      role: "teacher",
      avatar: "/placeholder.svg",
    },
    "student@example.com": {
      id: "3",
      name: "Student User",
      email: "student@example.com",
      role: "student",
      avatar: "/placeholder.svg",
    },
  }

  // Check if the email exists in our mock users
  const user = mockUsers[email]

  if (!user || password !== "password") {
    // In a real app, you would return an error
    return { success: false, message: "Invalid email or password" }
  }

  // Set a cookie with the user information
  // In a real app, you would set a session token instead of storing user data
  cookies().set({
    name: "currentUser",
    value: JSON.stringify(user),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  // Redirect to the callback URL or dashboard
  redirect(callbackUrl)
}

export async function logout() {
  // Clear the user cookie
  cookies().delete("currentUser")

  // Redirect to the home page
  redirect("/")
}

