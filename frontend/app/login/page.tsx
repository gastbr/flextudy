"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { login } from "./actions"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  console.log('login/page callBackURL', callbackUrl);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">FCT School</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input id="username" name="username" type="text" placeholder="Username" />
            </div>
            <div className="space-y-2">
              <Input id="password" name="password" type="password" placeholder="Password" />
              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Demo Accounts (password: "pass" for all)</p>
        <ul className="mt-2">
          <li>Admin: admintest</li>
          <li>Teacher: teachertest</li>
          <li>Student: studenttest</li>
        </ul>
      </div>
    </div>
  )
}

