"use client"
import Link from "next/link"
import { CalendarIcon, Calendar, Clock, Plus, ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, set } from "date-fns"
import { useState, useEffect } from "react"
import { useGet, usePut } from "@/hooks/use-fetch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import TopicEdit from "@/components/organisms/TopicEdit"
import TopicCreate from "@/components/organisms/TopicCreate"
import { redirect } from "next/navigation"
import DatePicker from "../ui/DatePicker"



export default function ClassEdit({
    classDetails,
    showEditClassDialog,
    setShowEditClassDialog,
    excuteGetClassById
}: {
    classDetails: any;
    showEditClassDialog?: boolean;
    setShowEditClassDialog?: (value: boolean) => void;
    propDate?: string
    excuteGetClassById?: () => void
}) {

    const [date, setDate] = useState<Date>()
    const [startTime, setStartTime] = useState<string>("")
    const [endTime, setEndTime] = useState<string>("")
    const [showNewTopicCreateDialog, setShowNewTopicCreateDialog] = useState(false)
    const [showNewTopicEditDialog, setShowNewTopicEditDialog] = useState(false)

    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [url, setUrl] = useState('');
    const [capacity, setCapacity] = useState(15);
    const [subjects, setSubject] = useState();
    const [topics, setTopics] = useState();
    const [lessonId, setLessonId] = useState('');

    const { fetch: userType, execute: putClass } = usePut(`/classes/edit/${classDetails?.id}`);

    useEffect(() => {
        const selectedTopic = topics?.find((topic) => topic.id === selectedTopicId)
        if (selectedTopic) {
            setSelectedTopic(selectedTopic)
        } else {
            setSelectedTopic('')
        }
    }, [selectedTopicId])

    useEffect(() => {
        if (classDetails) {
            setCapacity(classDetails.capacity);
            setDate(new Date(classDetails.start_time));
            setStartTime(format(new Date(classDetails.start_time), 'HH:mm'));
            setEndTime(format(new Date(classDetails.end_time), 'HH:mm'));
            setSelectedTopicId(classDetails.topic_id);
            setUrl(classDetails.location);
        }

    }, [classDetails]);

    const { fetch: data, loading, error, execute: executeGetToCreate } = useGet('/classes/to_create');


    useEffect(() => {
        if (data) {
            setTopics(data.topics)
            setSubject(data.subjects)

        } else
            if (error) {
                console.error('Error fetching user:', error);
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
            lesson_url: url
        };
        console.log("Class data:", classData);
        await putClass(classData);
        await excuteGetClassById();
        setShowEditClassDialog(false);
    };


    return (
        <>
            {classDetails && (
                <Dialog open={showEditClassDialog} onOpenChange={setShowEditClassDialog}>
                    <DialogContent aria-describedby={undefined}>
                        <DialogTitle></DialogTitle>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">Edit Class</h1>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Class Details</CardTitle>
                                    <CardDescription>Fill in the details to edit class</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Popover>
                                                <DatePicker selectedDate={date} setSelectedDate={setDate} />
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
                                            <Select value={selectedTopicId} onValueChange={(value) => setSelectedTopicId(value)}>
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
                                            <Input id="location" placeholder="Online link" value={url} onChange={(e) => setUrl(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Maximum Number of Students</Label>
                                            <Input id="capacity" type="number" min="1" placeholder="15" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard">Cancel</Link>
                                    </Button>
                                    <Button onClick={handleSubmit}>Edit Class</Button>
                                </CardFooter>
                            </Card>

                            {TopicEdit ? <TopicEdit showNewTopicEditDialog={showNewTopicEditDialog} setShowNewTopicEditDialog={setShowNewTopicEditDialog} subjects={subjects} topic={selectedTopic} executeGetToCreate={executeGetToCreate} /> : null}
                            {TopicCreate ? <TopicCreate showNewTopicCreateDialog={showNewTopicCreateDialog} setShowNewTopicCreateDialog={setShowNewTopicCreateDialog} subjects={subjects} executeGetToCreate={executeGetToCreate} /> : null}

                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}