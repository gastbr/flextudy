"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LessonProp {
  lessons: {
    id: number,
    title: string,
    start_time: string
    end_time: string
    lesson_url: string
    spots: string,
    teacher: string,
    status?: string,
  }[]
}

export default function ClassListView({ lessons }: LessonProp) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  lessons.sort((a, b) => {
    const dateA = new Date(a.start_time).getTime();
    const dateB = new Date(b.start_time).getTime();
    return dateA - dateB;
  });

  const classes = lessons.map((lesson) => {
    const startDate = new Date(lesson.start_time);
    const endDate = new Date(lesson.end_time);

    // Determinar el estado si no está proporcionado
    const status = lesson.status ||
      (parseInt(lesson.spots.split('/')[0]) < 0 ? 'full' : 'available');

    return {
      id: lesson.id,
      title: lesson.title,
      date: formatDate(lesson.start_time),
      time: `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`,
      teacher: lesson.teacher,
      status: status,
      spots: lesson.spots,
    };
  });

  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <Card key={cls.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="p-4 sm:p-6 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{cls.title}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cls.date} • {cls.time}
                    </div>
                  </div>
                  <StatusBadge status={cls.status as "enrolled" | "available" | "full"} />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{cls.teacher[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{cls.teacher}</span>
                </div>
              </div>

              <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
                <div className="text-sm">
                  <span className="text-muted-foreground">Spots:</span> {cls.spots}
                </div>

                <Button variant={cls.status === "enrolled" ? "outline" : "default"} disabled={cls.status === "full"}>
                  {cls.status === "enrolled" ? "View Details" : "Enroll"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
