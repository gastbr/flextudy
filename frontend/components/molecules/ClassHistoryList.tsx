"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface ClassHistoryListProps {
  type: "enrolled" | "completed",
  classes: Array<{
    id: number
    title: string
    teacher: string
    date: string
    progress?: string
    rating?: number
    teacher_username?: string
    teacher_name?: string
  }>,
  completed?: boolean
  userType: string
}

export default function ClassHistoryList({ type, classes }: ClassHistoryListProps) {
  // Pagination state
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(classes.length / pageSize)
  const paginatedClasses = classes.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No {type} classes found</div>
      ) : (
        <>
          {paginatedClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b last:border-0"
            >
              <div>
                <Link href={`/dashboard/classes/${cls.id}`} className="hover:underline">
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
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      setPage(p => Math.max(1, p - 1))
                    }}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={e => {
                          e.preventDefault()
                          setPage(p)
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      setPage(p => Math.min(totalPages, p + 1))
                    }}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
