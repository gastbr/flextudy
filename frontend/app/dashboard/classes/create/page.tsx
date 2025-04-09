"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Plus, ArrowLeft, Edit } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CreateClassPage() {
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false)
  // const [showNewSubjectDialog, setShowNewSubjectDialog] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('');
  const [url, setUrl] = useState('');
  const [capacity, setCapacity] = useState(15);

  console.log(date);
  console.log(startTime);
  // console.log(endTime);



  function combineDateAndTimeToISO(dateString:string , timeString:string) {
    // Parsear la fecha original
    const date = new Date(dateString);
    
    // Extraer horas y minutos del string de tiempo
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Aplicar la hora a la fecha, manteniendo el mismo offset de zona horaria
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    // Convertir a formato ISO 8601 (UTC)
    return date.toISOString();
    
    // Alternativa si prefieres mantener la zona horaria original:
    // return date.toISOString().slice(0, -1) + dateString.slice(-6); // Mantiene el offset
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    const classData = {
      max_capacity : capacity,
      start_time : combineDateAndTimeToISO(date, startTime),
      end_time :  combineDateAndTimeToISO(date, endTime),
      topic_id: selectedTopic,
      lesson_url: url,
    };
    console.log('Datos de la clase:', classData);
    // Lógica para enviar los datos al servidor
  };


  // Sample data for topics and subjects
  const topics = [
    { id: "1", title: "Introduction to Algebra", subject: "Mathematics" },
    { id: "2", title: "Spanish Conversation", subject: "Languages" },
    { id: "3", title: "Classical Mechanics", subject: "Physics" },
  ]

  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Languages" },
    { id: "3", name: "Physics" },
    { id: "4", name: "Chemistry" },
    { id: "5", name: "History" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Class</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
          <CardDescription>Fill in the details to create a new class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="space-y-2">
              <Label htmlFor="title">Class Title</Label>
              <Input id="title" placeholder="Enter class title" />
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setSelectedTopic(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title} ({topic.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowNewTopicDialog(true)}>
                <Plus className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={() => setShowNewTopicDialog(true)}>
                <Edit className="h-4 w-4" />
              </Button>


            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description">Class Description</Label>
            <Textarea id="description" placeholder="Provide a detailed description of the class" rows={4} />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Url</Label>
              <Input id="location" placeholder="Online link" onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Maximum Number of Students</Label>
              <Input id="capacity" type="number" min="1" value="15" onChange={(e) => setCapacity(e.target.value)}/>
            </div>

          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit}>Create Class</Button>
        </CardFooter>
      </Card>

      {/* New Topic Dialog */}
      <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>Add a new topic for your classes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topicTitle">Topic Title</Label>
              <Input id="topicTitle" placeholder="Enter topic title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicSubject">Subject</Label>
              <div className="flex gap-2">
                <Select >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setShowNewTopicDialog(false)
                    setShowNewSubjectDialog(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button> */}

              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicDescription">Description</Label>
              <Textarea id="topicDescription" placeholder="Provide a description of this topic" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTopicDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewTopicDialog(false)}>Create Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Subject Dialog */}
      {/* <Dialog open={showNewSubjectDialog} onOpenChange={setShowNewSubjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
            <DialogDescription>Add a new subject category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input id="subjectName" placeholder="Enter subject name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectDescription">Description</Label>
              <Textarea id="subjectDescription" placeholder="Provide a description of this subject" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewSubjectDialog(false)
                setShowNewTopicDialog(true)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowNewSubjectDialog(false)
                setShowNewTopicDialog(true)
              }}
            >
              Create Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
