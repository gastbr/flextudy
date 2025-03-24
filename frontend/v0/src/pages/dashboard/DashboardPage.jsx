"use client"

import { useState, useMemo } from "react"
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, List, Users, Clock } from "lucide-react"
import Button from "../../components/ui/Button.jsx"
import { Card, CardContent } from "../../components/ui/Card.jsx"
import Badge from "../../components/ui/Badge.jsx"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/Tabs.jsx"
import DashboardLayout from "../../components/layout/DashboardLayout.jsx"

// Sample class/event data
const classEvents = [
  {
    id: 1,
    title: "Math 101",
    date: new Date(2025, 2, 25, 10, 0),
    endTime: new Date(2025, 2, 25, 11, 30),
    teacher: "Prof. Johnson",
    students: 12,
    credits: 2,
    room: "Room A101",
  },
  {
    id: 2,
    title: "Physics Lab",
    date: new Date(2025, 2, 25, 14, 0),
    endTime: new Date(2025, 2, 25, 16, 0),
    teacher: "Dr. Smith",
    students: 8,
    credits: 3,
    room: "Lab B202",
  },
  {
    id: 3,
    title: "English Literature",
    date: new Date(2025, 2, 26, 9, 0),
    endTime: new Date(2025, 2, 26, 10, 30),
    teacher: "Ms. Davis",
    students: 15,
    credits: 2,
    room: "Room C303",
  },
  {
    id: 4,
    title: "Computer Science",
    date: new Date(2025, 2, 27, 13, 0),
    endTime: new Date(2025, 2, 27, 15, 0),
    teacher: "Prof. Wilson",
    students: 20,
    credits: 4,
    room: "Lab D404",
  },
  {
    id: 5,
    title: "Art Workshop",
    date: new Date(2025, 2, 28, 11, 0),
    endTime: new Date(2025, 2, 28, 13, 0),
    teacher: "Ms. Thompson",
    students: 10,
    credits: 2,
    room: "Studio E505",
  },
]

// Role-specific permissions (would come from auth context in a real app)
const userRole = "Admin" // Could be 'Admin', 'Teacher', or 'Student'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 24)) // March 24, 2025
  const [viewMode, setViewMode] = useState("month")
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 24))

  // Generate calendar days for the month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [currentDate])

  // Filter events for the selected date or month
  const filteredEvents = useMemo(() => {
    if (viewMode === "list") {
      return classEvents.filter((event) => isSameDay(event.date, selectedDate))
    } else {
      return classEvents.filter((event) => isSameMonth(event.date, currentDate))
    }
  }, [viewMode, selectedDate, currentDate, classEvents])

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return classEvents.filter((event) => isSameDay(event.date, day))
  }

  // Role-specific actions
  const canEditClasses = userRole === "Admin" || userRole === "Teacher"
  const canEnrollInClasses = userRole === "Student"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-500">
              View and manage your {userRole.toLowerCase() === "student" ? "enrolled" : ""} classes and schedule
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="month">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-3">
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="bg-primary h-1"></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{event.title}</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(event.date, "h:mm a")} - {format(event.endTime, "h:mm a")}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Users className="h-4 w-4 mr-1" />
                                {event.students} students
                              </div>
                              <div className="mt-2">
                                <Badge variant="outline">{event.room}</Badge>
                                <Badge variant="secondary" className="ml-2">
                                  {event.credits} credits
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {canEditClasses && (
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              )}
                              {canEnrollInClasses && <Button size="sm">Enroll</Button>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No classes scheduled for this day</div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center p-2 font-medium text-gray-500">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, i) => {
                    const dayEvents = getEventsForDay(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    const isSelected = isSameDay(day, selectedDate)

                    return (
                      <div
                        key={i}
                        className={`min-h-[100px] border p-1 transition-colors ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                          } ${isToday ? "border-primary" : ""} ${isSelected ? "bg-primary/10" : ""
                          } hover:bg-gray-50 cursor-pointer`}
                        onClick={() => {
                          setSelectedDate(day)
                          setViewMode("list")
                        }}
                      >
                        <div className="text-sm font-medium">{format(day, "d")}</div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                              title={event.title}
                            >
                              {format(event.date, "h:mm a")} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-specific actions */}
        <div className="flex justify-end gap-2">
          {canEditClasses && <Button>{userRole === "Admin" ? "Create New Class" : "Schedule Class"}</Button>}
          {userRole === "Admin" && <Button variant="outline">Manage Teachers</Button>}
          {userRole === "Teacher" && <Button variant="outline">Take Attendance</Button>}
          {userRole === "Student" && <Button variant="outline">View My Credits</Button>}
        </div>
      </div>
    </DashboardLayout>
  )
}