"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BookOpen, Settings } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/90 to-primary px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white">Your All-in-One Educational Hub.</h1>
              <p className="text-xl text-white/90 max-w-xl">
              Effortlessly manage your classes (in-person or virtual), interact with teachers and students, and unlock a world of limitless learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Calendar Interface Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Designed for Every Role in Your School</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Feature */}
            <div className="bg-background rounded-xl p-6 shadow-md border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
              <p className="text-muted-foreground mb-4">
                Manage users, pricing, and platform settings. Get insights into class attendance and financial
                performance.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  User management and role assignment
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Platform-wide settings configuration
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Comprehensive reporting tools
                </li>
              </ul>
            </div>

            {/* Teacher Feature */}
            <div className="bg-background rounded-xl p-6 shadow-md border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Teachers</h3>
              <p className="text-muted-foreground mb-4">
                Create and edit classes, track attendance, and communicate directly with your students.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Intuitive class creation and management
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Attendance tracking with export options
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Direct messaging with enrolled students
                </li>
              </ul>
            </div>

            {/* Student Feature */}
            <div className="bg-background rounded-xl p-6 shadow-md border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Students</h3>
              <p className="text-muted-foreground mb-4">
                Browse and enroll in classes, manage payments through a wallet system, and rate your sessions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Easy class discovery and enrollment
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Secure wallet for credit purchases
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Session feedback and rating system
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar-Centric Section */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Calendar Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>Calendar-Centric Design</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Your Schedule, Your Way</h2>
              <p className="text-muted-foreground">
                Our intuitive calendar interface adapts to your role, showing exactly what you need:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">S</span>
                  </div>
                  <div>
                    <span className="font-medium">Students</span>
                    <p className="text-sm text-muted-foreground">View available classes and manage enrollments</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">T</span>
                  </div>
                  <div>
                    <span className="font-medium">Teachers</span>
                    <p className="text-sm text-muted-foreground">Create and edit classes, access student lists</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">A</span>
                  </div>
                  <div>
                    <span className="font-medium">Administrators</span>
                    <p className="text-sm text-muted-foreground">Oversee all events and manage platform settings</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Educational Management?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join schools and academies that have streamlined their operations, improved student engagement, and
              simplified administrative tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">FLEXTUDY</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FLEXTUDY. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

