"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { usePost, useDelete } from "@/hooks/use-fetch"
import { AvatarImage } from "@radix-ui/react-avatar"
import Link from "next/link"


interface LessonProp {
  cls: any
  getDashboard: () => void;
  currentUser?: { username: string; user_type_name: string }; // add currentUser prop
}

export default function ClassListViewCard({ cls, getDashboard, currentUser }: LessonProp) {
  const { execute: cancelEnrollmentAPI } = useDelete(`/attend/${cls.id}`);
  const { execute: enrollAPI } = usePost(`/attend/${cls.id}`);


  const handleCancelEnrollment = async () => {
    try {
      await cancelEnrollmentAPI();
      await getDashboard();
    } catch (error) {
      console.error("Error canceling enrollment:", error);
    }
  };

  const handleEnrollment = async () => {
    try {
      await enrollAPI();
      await getDashboard();
    } catch (error) {
      console.error("Error canceling enrollment:", error);
    }
  };

  console.log("clsss", cls);

  return (
    <Card key={cls.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="p-4 sm:p-6 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`dashboard/classes/${cls.id}`} className="hover:underline">
                  <h3 className="font-semibold text-lg">{cls.title}</h3>
                </Link>
                <div className="text-sm text-muted-foreground mt-1">
                  {cls.date} • {cls.time}
                </div>
              </div>
              <StatusBadge status={cls.status as "enrolled" | "available" | "full"} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Link href={`/dashboard/profile/${cls.teacher_username}`}>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={cls.teacher_avatar} alt="Teacher" />
                  <AvatarFallback>{cls.teacher_name[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/dashboard/profile/${cls.teacher_username}`} className="text-sm hover:underline">
                {cls.teacher_name}
              </Link>
            </div>
          </div>

          <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
            <div className="text-sm">
              <span className="text-muted-foreground">Spots:</span> {cls.spots}
            </div>
            {
              cls.status === "enrolled" && (
                <Button
                  variant="outline"
                  onClick={handleCancelEnrollment}
                >
                  Cancel Enrollment
                </Button>
              )
            }
            {/* Hide Enroll button for teachers */}
            {cls.status === "available" && currentUser?.user_type_name !== "teacher" && (
              <Button variant="default"
                onClick={handleEnrollment}
              >Enroll</Button>
            )}
            {
              cls.status === "full" && (
                <Button variant="secondary" disabled>Full</Button>
              )
            }
          </div>
        </div>
      </CardContent>
    </Card >
  )
}

interface StatusBadgeProps {
  status: "enrolled" | "available" | "full"
}

function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    enrolled: { variant: "default" as const, label: "Enrolled" },
    available: { variant: "outline" as const, label: "Available" },
    full: { variant: "secondary" as const, label: "Full" },
  }

  const { variant, label } = variants[status]

  return <Badge variant={variant}>{label}</Badge>
}
