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

export default function ClassHistoryList({ type, classes, completed, userType }: ClassHistoryListProps) {

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
              <h3 className="font-medium">{cls.title}</h3>
              <div className="text-sm text-muted-foreground">Instructor: {cls.teacher}</div>
              <div className="text-sm text-muted-foreground">{cls.date}</div>
            </div>

            <div className="flex items-center gap-4">

              <Link href={`/dashboard/classes/${cls.id}`} className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  View Class
                </Button>
              </Link>
              {/* <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{(cls as any).rating}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Certificate
                  </Button> */}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
