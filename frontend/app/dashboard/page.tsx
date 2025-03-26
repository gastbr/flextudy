"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, List, Grid3X3 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<"list" | "month">("month")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [lessons, setLessons] = useState([]) // Estado para almacenar las lecciones

  // Fetch lessons from the API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("http://localhost:8000/v1/lessons")
        const data = await response.json()
        setLessons(data) // Guardar las lecciones en el estado
      } catch (error) {
        console.error("Error fetching lessons:", error)
      }
    }

    fetchLessons()
  }, [])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage your classes and schedule</p>
        </div>

        {/* This button would only be visible to teachers */}
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Create Class</span>
        </Button>
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

      {viewMode === "list" ? <ClassListView /> : <MonthCalendarView month={currentMonth} />}
    </div>
  )
}

function ClassListView() {
  // Sample class data
  const classes = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      date: "Mon, May 15",
      time: "09:00 - 10:30",
      teacher: "Dr. Smith",
      status: "enrolled",
      spots: "12/15",
    },
    {
      id: 2,
      title: "Advanced Physics",
      date: "Tue, May 16",
      time: "11:00 - 12:30",
      teacher: "Prof. Johnson",
      status: "available",
      spots: "8/20",
    },
    {
      id: 3,
      title: "Spanish for Beginners",
      date: "Wed, May 17",
      time: "14:00 - 15:30",
      teacher: "Ms. Garcia",
      status: "full",
      spots: "15/15",
    },
  ]

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

interface MonthCalendarViewProps {
  month: Date
}

function MonthCalendarView({ month }: MonthCalendarViewProps) {
  // Generate calendar days
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 0).getDay()

  // Sample class data
  const events = [
    { id: 1, title: "Math 101", date: new Date(2025, 2, 15), time: "09:00 - 10:30", status: "enrolled" },
    { id: 2, title: "Physics", date: new Date(2025, 2, 16), time: "11:00 - 12:30", status: "available" },
    { id: 3, title: "Spanish", date: new Date(2025, 2, 17), time: "14:00 - 15:30", status: "full" },
    { id: 4, title: "History", date: new Date(2025, 2, 15), time: "13:00 - 14:30", status: "enrolled" },
    { id: 5, title: "Chemistry", date: new Date(2025, 2, 22), time: "10:00 - 11:30", status: "available" },
  ]

  // Filter events for the current month
  const filteredEvents = events.filter(
    (event) =>
      event.date.getFullYear() === month.getFullYear() &&
      event.date.getMonth() === month.getMonth()
  )

  // Create calendar grid
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth

    // Get events for this day
    const dayEvents = isCurrentMonth
      ? filteredEvents.filter((event) => event.date.getDate() === dayNumber)
      : []

    return {
      number: isCurrentMonth ? dayNumber : null,
      events: dayEvents,
    }
  })

  const weekdays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-muted">
        {weekdays.map((day, i) => (
          <div key={i} className="p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, i) => (
          <div
            key={i}
            className={`min-h-[100px] border-t border-l p-1 ${
              day.number ? "bg-background" : "bg-muted/50"
            } ${i % 7 === 6 ? "border-r" : ""} ${Math.floor(i / 7) === 5 ? "border-b" : ""}`}
          >
            {day.number && (
              <>
                <div className="text-sm font-medium p-1">{day.number}</div>
                <div className="space-y-1">
                  {day.events.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.status === "enrolled"
                          ? "bg-primary/10 text-primary"
                          : event.status === "available"
                          ? "bg-muted hover:bg-muted/80 cursor-pointer"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

