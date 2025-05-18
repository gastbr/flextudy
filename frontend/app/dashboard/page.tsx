"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, List, Grid3X3, CalendarArrowDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ClassListView from "@/components/organisms/ClassListView"
import MonthCalendarView from "@/components/organisms/MonthCalendarView"
import Link from "next/link"
import { useGet } from "@/hooks/use-fetch"
import { useProvider } from '@/app/context/provider'

export type Lesson = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  lesson_url: string;
  status: string;
  teacher_username: string;
  teacher_name: string;
  teacher_avatar: string;
  spots: string;
  max_capacity: number;
  topic_id: number;
}

export default function CalendarView() {

  const [viewMode, setViewMode] = useState<"list" | "month">("month")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date();
  const [lessons, setLessons] = useState<Lesson[]>([])
  const { fetch: data, execute: getDashboard } = useGet('/dashboard/lessons');
  const { state } = useProvider();
  const [filter, setFilter] = useState('all');
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filterOptions =
    state.currentUser?.user_type_name === "teacher"
      ? [
        { value: "all", label: "All Classes" },
        { value: "my", label: "My Classes" },
      ] : [
        { value: "all", label: "All Classes" },
        { value: "enrolled", label: "Enrolled Only" },
        { value: "available", label: "Available to Join" },
      ]

  useEffect(() => {
    if (data) setLessons(data)
  }, [data])

  // Reset page when filter or month changes
  useEffect(() => {
    setPage(1);
  }, [filter, currentMonth]);

  // Function to format date as Month YYYY
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Function to navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  // Function to navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  //   // EXAMPLES OF HOW TO USE USEREDUCER/USECONTEXT
  // useEffect(() => {
  //   // dispatch({ type: "ADD", campo: "trolo", payload: "trolo" });
  //   // dispatch({ type: "ADD", campo: "lotro", payload: "lotro" });
  //   // dispatch({ type: "DELETE", campo: "lotro" });
  //   // dispatch({ type: "UPDATE", campo: "trolo", payload: "lotrolotrolotro" });
  // }, []);

  // EXAMPLE HOW TO CONSUME
  //   import { useProvider } from "@/app/context/provider"
  //   const {context, setContext, state, dispatch,} = useProvider()

  const filteredLessons = lessons.filter(lesson => {
    if (state.currentUser?.user_type_name === "teacher") {
      if (filter === "my") {
        return lesson?.teacher_username === state.currentUser?.username
      }
      return true // "all"
    } else {
      if (filter === "enrolled") {
        return lesson.status === "enrolled"
      }
      if (filter === "available") {
        return lesson.status === "available"
      }
      return true // "all"
    }
  })

  // Helper: check if a lesson is in the current month
  const isLessonInMonth = (lesson: Lesson, month: Date) => {
    const lessonDate = new Date(lesson.start_time)
    return (
      lessonDate.getFullYear() === month.getFullYear() &&
      lessonDate.getMonth() === month.getMonth()
    )
  }

  // Pagination helpers
  const monthLessons = filteredLessons.filter(lesson => isLessonInMonth(lesson, currentMonth));
  const totalLessons = monthLessons.length;
  const totalPages = Math.ceil(totalLessons / pageSize);
  const paginatedLessons = monthLessons.slice((page - 1) * pageSize, page * pageSize);

  // Helper: check if a date is today
  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage your classes and schedule</p>
        </div>

        {/* This button would only be visible to teachers */}

        {
          state.currentUser?.user_type_name === "teacher" && (
            <Button asChild className="flex items-center gap-2">
              <Link href="/dashboard/classes/create">
                <Plus className="h-4 w-4" />
                <span>Create Class</span>
              </Link>
            </Button>
          )
        }

      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">{formatMonth(currentMonth)}</div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(new Date())}
            aria-label="Go to today"
            className="ml-2"
          >
            <CalendarArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">

          {state.currentUser?.user_type_name !== "admin" && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("month")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "list"
        ? (() => {
          if (monthLessons.length === 0) {
            return (
              <div className="text-center text-muted-foreground py-12">
                No classes found for selected dates
              </div>
            );
          }
          return (
            <>
              <ClassListView
                lessons={paginatedLessons}
                getDashboard={getDashboard}
                currentUser={state.currentUser}
              />
              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>
                    Page {page} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={pageSize}
                    onChange={e => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          );
        })()
        : (
          <MonthCalendarView
            month={currentMonth}
            lessons={filteredLessons}
            currentUser={state.currentUser}
            today={today}
          />
        )
      }
    </div>
  )
}