"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { User, UserRole } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if the user is logged in
    const userJson = localStorage.getItem("currentUser")

    if (!userJson) {
      // Redirect to login if not logged in
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    try {
      const user = JSON.parse(userJson) as User

      // If specific roles are required, check if the user has one of them
      if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(user.role)) {
          // Redirect to dashboard if the user doesn't have the required role
          router.push("/dashboard")
          return
        }
      }

      // User is authorized
      setIsAuthorized(true)
    } catch (error) {
      // If parsing fails, redirect to login
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [pathname, requiredRoles, router])

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

