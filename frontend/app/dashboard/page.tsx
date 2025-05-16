"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, List, Grid3X3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ClassListView from "@/components/organisms/ClassListView"
import MonthCalendarView from "@/components/organisms/MonthCalendarView"
import Link from "next/link"
import { useGet } from "@/hooks/use-fetch"
import { useProvider } from '@/app/context/provider'

export default function CalendarView() {

  const [viewMode, setViewMode] = useState<"list" | "month">("month")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [lessons, setLessons] = useState([])
  const { fetch: data, loading, error, execute: getDashboard } = useGet('/dashboard/lessons');
  const { state } = useProvider();

  useEffect(() => {
    if (data) setLessons(data)
  }, [data])

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
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="enrolled">Enrolled Only</SelectItem>
              <SelectItem value="available">Available to Join</SelectItem>
            </SelectContent>
          </Select>

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

      {viewMode === "list" ? <ClassListView lessons={lessons} getDashboard={getDashboard} /> : <MonthCalendarView month={currentMonth} lessons={lessons} />}
    </div>
  )
}