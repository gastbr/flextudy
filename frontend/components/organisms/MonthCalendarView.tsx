interface MonthCalendarViewProps {
  month: Date
  lessons: {
    id: number
    title: string
    max_capacity: number
    start_time: string
    end_time: string
    lesson_url: string
    topic_id: number
  }[]
}

export default function MonthCalendarView({ month, lessons }: MonthCalendarViewProps) {
  // Generate calendar days
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 0).getDay()

  const events = lessons.map((lesson) => {
    const startDate = new Date(lesson.start_time)
    const endDate = new Date(lesson.end_time)
    
    // Formatear la hora como "HH:MM - HH:MM"
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const timeString = `${formatTime(startDate)} - ${formatTime(endDate)}`
    
    // Determinar el estado basado en la capacidad (esto es un ejemplo, ajusta según tu lógica)
    let status = "available"
    // Aquí puedes agregar lógica para determinar si está "enrolled" o "full"
    
    return {
      id: lesson.id,
      title: lesson.title, // O podrías usar otro campo como título
      date: new Date(startDate),
      time: timeString,
      status: status
    }
  })
  events.sort((a, b) => a.date.getTime() - b.date.getTime())

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
                      {event.title} - {event.time} 
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

