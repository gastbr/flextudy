"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ClassHistoryListProps {
  type: "enrolled" | "completed",
  classes: Array<{
    id: number
    title: string
    teacher: string
    date: string
    progress?: string
    rating?: number
  }>,
  completed?: boolean
  userType: string
}

export default function ClassHistoryList({ type, classes }: ClassHistoryListProps) {

  console.log(classes);

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No {type} classes found</div>
      ) : (
        classes.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b last:border-0"
          >
            <div>
              <Link href={`dashboard/classes/${cls.id}`} className="hover:underline">
                {cls.title}
              </Link>
              <div className="text-sm text-muted-foreground">
                <Link href={`${cls.teacher_username}`} className="hover:underline">
                  <span>{cls.teacher_name}</span>
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">{cls.date}</div>
            </div>

            <div className="flex items-center gap-4">

              <Link href={`/dashboard/classes/${cls.id}`} className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  View Class
                </Button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
