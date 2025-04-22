"use client"

import { useState, useEffect, use } from "react"
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
import Link from "next/link"
import TopicEdit from "@/components/organisms/TopicEdit"
import TopicCreate from "@/components/organisms/TopicCreate"
import { useGet } from "@/hooks/use-fetch"

export default function CreateClassPage() {
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [showNewTopicCreateDialog, setShowNewTopicCreateDialog] = useState(false)
  const [showNewTopicEditDialog, setShowNewTopicEditDialog] = useState(false)

  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false)

  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [url, setUrl] = useState('');
  const [capacity, setCapacity] = useState(15);
  const [subjects, setSubject] = useState();
  const [topics, setTopics] = useState();


  useEffect(() => {
    const selectedTopic = topics?.find((topic) => topic.id === selectedTopicId)
    if (selectedTopic) {
      setSelectedTopic(selectedTopic)
    } else {
      setSelectedTopic('')
    }
  }, [selectedTopicId])



  const { fetch: data, loading, error } = useGet('/classes/to_create');

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
    } else {
      if (data) {
        console.log('User data:', data);
        setTopics(data.topics)
        setSubject(data.subjects)
      }
      if (error) {
        console.error('Error fetching user:', error);
      }
    }
  }, [data, error, loading]);


  function combineDateAndTimeToISO(dateString: string, timeString: string) {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const classData = {
      max_capacity: capacity,
      start_time: combineDateAndTimeToISO(date, startTime),
      end_time: combineDateAndTimeToISO(date, endTime),
      topic_id: selectedTopicId,
      lesson_url: url,
    };

    const response = await fetch('http://localhost:8000/v1/classes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData)
    });

    const data = await response.json();
    console.log(data);

    console.log('Datos de la clase:', classData);
  };

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
              <Select onValueChange={(value) => setSelectedTopicId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                {topics ? (
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                ) : null}
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowNewTopicCreateDialog(true)}>
                <Plus className="h-4 w-4" />
              </Button>

              {
                selectedTopicId ? (
                  <Button variant="outline" size="icon" onClick={() => setShowNewTopicEditDialog(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                ) : null
              }
          


            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Url</Label>
              <Input id="location" placeholder="Online link" onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Maximum Number of Students</Label>
              <Input id="capacity" type="number" min="1" placeholder="15" onChange={(e) => setCapacity(e.target.value)} />
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

      {TopicEdit ? <TopicEdit showNewTopicEditDialog={showNewTopicEditDialog} setShowNewTopicEditDialog={setShowNewTopicEditDialog} subjects={subjects} topic={selectedTopic} /> : null}
      {TopicCreate ? <TopicCreate showNewTopicCreateDialog={showNewTopicCreateDialog} setShowNewTopicCreateDialog={setShowNewTopicCreateDialog} subjects={subjects}  /> : null}

    </div>
  )
}
