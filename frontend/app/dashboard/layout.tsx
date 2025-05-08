'use client'

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Wallet, Settings, User, LogOut, Menu, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useProvider } from '@/app/context/provider'
import { useEffect, useState } from "react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function handleLogout() {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  sessionStorage.clear();
  window.location.href = '/login';
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {

  const { state } = useProvider();
  const [user, setUser] = useState("");
  // const user = state?.flextudy.currentUser;
  useEffect(() => {
    setUser(state?.currentUser)
  }, [state])

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader user={user} />
      <div className="flex-1 flex flex-col md:flex-row">
        <DashboardSidebar user={user} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function DashboardHeader({ user }: { user: any }) {

  return (
    <header className="h-16 border-b bg-background flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <MobileSidebar user={user} />
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg hidden md:inline-block">FLEXTUDY</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Notifications</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/profile/me" className="flex items-center gap-2 hover:bg-muted p-2 rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile_pic} alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                      <div className="text-sm font-medium">{user?.username}</div>
                      <div className="text-xs text-muted-foreground">{user?.user_type_name?.toUpperCase()}</div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs round-sm ">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        </div>
      </div>
    </header>
  )
}

function MobileSidebar({ user }: { user: any }) {

  const profileHref = `/dashboard/profile/${user?.id}`;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="h-16 border-b flex items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">FLEXTUDY</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-2 h-[calc(100vh-4rem)] justify-between">
          <NavItem href="/dashboard" icon={<Calendar className="h-4 w-4" />} label="Calendar" />
          <NavItem href="/dashboard/classes" icon={<Users className="h-4 w-4" />} label="My Classes" />
          <NavItem href="/dashboard/wallet" icon={<Wallet className="h-4 w-4" />} label="Wallet" />
          <NavItem href="/dashboard/profile/me" icon={<User className="h-4 w-4" />} label="Profile" />
          <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />

          {/* Admin-only items */}
          {user?.user_type_name === "admin" && (
            <div className="mt-2 pt-2 border-t">
              <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Admin settings</div>
              <NavItem
                href="/dashboard/users"
                icon={<Users className="h-4 w-4" />}
                label="User Management"
              />
              <NavItem
                href="/dashboard/teachers"
                icon={<GraduationCap className="h-4 w-4" />}
                label="Teacher Management"
              />
              <NavItem
                href="/dashboard/admin/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Platform Settings"
              />
            </div>
          )}

          <div className="mt-auto pt-2" onClick={handleLogout}>
            <Button variant="destructiveGhost" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function DashboardSidebar({ user }: { user: any }) {

  return (
    <aside className="hidden md:flex w-64 border-r flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-2 flex-1 justify-between">
        <div className="flex flex-col">
          <NavItem href="/dashboard" icon={<Calendar className="h-4 w-4" />} label="Calendar" />
          <NavItem href="/dashboard/classes" icon={<Users className="h-4 w-4" />} label="My Classes" />
          <NavItem href="/dashboard/wallet" icon={<Wallet className="h-4 w-4" />} label="Wallet" />
          <NavItem href="/dashboard/profile/me" icon={<User className="h-4 w-4" />} label="Profile" />
          <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
          {/* Admin-only items */}
          {user?.user_type_name === 'admin' && (
            <div className="mt-2 pt-2 border-t">
              <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Admin settings</div>
              <NavItem
                href="/dashboard/users"
                icon={<Users className="h-4 w-4" />}
                label="User Management"
              />
              <NavItem
                href="/dashboard/teachers"
                icon={<GraduationCap className="h-4 w-4" />}
                label="Teacher Management"
              />
              <NavItem
                href="/dashboard/admin/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Platform Settings"
              />
            </div>
          )}

        </div>

        <div
          onClick={handleLogout}>
          <Button
            variant="destructiveGhost"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </nav>
    </aside >
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted">
      {icon}
      <span>{label}</span>
    </Link>
  )
}

