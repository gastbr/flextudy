"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Search, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function MyClassesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterSubject, setFilterSubject] = useState("all")

    // Sample data for classes
    const teachingClasses = [
        {
            id: "1",
            title: "Introduction to Mathematics",
            subject: "Mathematics",
            date: "Every Monday",
            time: "09:00 - 10:30",
            location: "Room 101",
            enrolled: 12,
            capacity: 15,
            status: "active",
        },
        {
            id: "2",
            title: "Advanced Calculus",
            subject: "Mathematics",
            date: "Every Wednesday",
            time: "11:00 - 12:30",
            location: "Room 203",
            enrolled: 8,
            capacity: 10,
            status: "active",
        },
        {
            id: "3",
            title: "Physics for Beginners",
            subject: "Physics",
            date: "Every Thursday",
            time: "14:00 - 15:30",
            location: "Lab 3",
            enrolled: 15,
            capacity: 15,
            status: "full",
        },
    ]

    const enrolledClasses = [
        {
            id: "4",
            title: "Spanish Conversation",
            subject: "Languages",
            teacher: "Ms. Garcia",
            date: "Every Tuesday",
            time: "16:00 - 17:30",
            location: "Room 105",
            progress: "3/10 sessions",
            status: "active",
        },
        {
            id: "5",
            title: "World History",
            subject: "History",
            teacher: "Dr. Johnson",
            date: "Every Friday",
            time: "10:00 - 11:30",
            location: "Room 302",
            progress: "5/12 sessions",
            status: "active",
        },
    ]

    const pastClasses = [
        {
            id: "6",
            title: "Chemistry Fundamentals",
            subject: "Chemistry",
            teacher: "Prof. Smith",
            date: "Completed on Apr 15, 2023",
            rating: 4.5,
            status: "completed",
        },
        {
            id: "7",
            title: "Literature Classics",
            subject: "Literature",
            teacher: "Dr. Williams",
            date: "Completed on Mar 20, 2023",
            rating: 5,
            status: "completed",
        },
    ]

    // Filter classes based on search query and subject filter
    const filterClasses = (classes) => {
        return classes.filter((cls) => {
            const matchesSearch =
                cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cls.subject && cls.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (cls.teacher && cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesSubject = filterSubject === "all" || cls.subject === filterSubject

            return matchesSearch && matchesSubject
        })
    }

    const filteredTeachingClasses = filterClasses(teachingClasses)
    const filteredEnrolledClasses = filterClasses(enrolledClasses)
    const filteredPastClasses = filterClasses(pastClasses)

    // Get unique subjects for filter dropdown
    const allSubjects = [
        ...new Set([
            ...teachingClasses.map((c) => c.subject),
            ...enrolledClasses.map((c) => c.subject),
            ...pastClasses.map((c) => c.subject),
        ]),
    ].sort()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
                    <p className="text-muted-foreground">View and manage all your classes</p>
                </div>

                <Button asChild className="flex items-center gap-2">
                    <Link href="/dashboard/classes/create">
                        <Plus className="h-4 w-4" />
                        <span>Create Class</span>
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search classes..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-[200px]">
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Filter by subject" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {allSubjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                    {subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="teaching">
                <TabsList className="mb-4">
                    <TabsTrigger value="teaching">Teaching</TabsTrigger>
                    <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                    <TabsTrigger value="past">Past Classes</TabsTrigger>
                </TabsList>

                <TabsContent value="teaching">
                    {filteredTeachingClasses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No classes found</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTeachingClasses.map((cls) => (
                                <TeachingClassCard key={cls.id} classData={cls} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="enrolled">
                    {filteredEnrolledClasses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No classes found</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredEnrolledClasses.map((cls) => (
                                <EnrolledClassCard key={cls.id} classData={cls} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past">
                    {filteredPastClasses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No classes found</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredPastClasses.map((cls) => (
                                <PastClassCard key={cls.id} classData={cls} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

function TeachingClassCard({ classData }) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    <Link href={`/dashboard/classes/${classData.id}`} className="hover:underline">
                                        {classData.title}
                                    </Link>
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                    {classData.subject}
                                </Badge>
                            </div>
                            <StatusBadge status={classData.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{classData.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{classData.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{classData.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                    {classData.enrolled}/{classData.capacity} students
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-muted-foreground">Enrollment</span>
                            <div className="text-lg font-medium">{Math.round((classData.enrolled / classData.capacity) * 100)}%</div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button asChild>
                                <Link href={`/dashboard/classes/${classData.id}`}>View Details</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/dashboard/classes/${classData.id}/attendance`}>Attendance</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EnrolledClassCard({ classData }) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    <Link href={`/dashboard/classes/${classData.id}`} className="hover:underline">
                                        {classData.title}
                                    </Link>
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                    {classData.subject}
                                </Badge>
                            </div>
                            <StatusBadge status={classData.status} />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>{classData.teacher[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{classData.teacher}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{classData.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{classData.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{classData.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <div className="text-lg font-medium">{classData.progress}</div>
                        </div>

                        <Button asChild>
                            <Link href={`/dashboard/classes/${classData.id}`}>View Details</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PastClassCard({ classData }) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    <Link href={`/dashboard/classes/${classData.id}`} className="hover:underline">
                                        {classData.title}
                                    </Link>
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                    {classData.subject}
                                </Badge>
                            </div>
                            <StatusBadge status={classData.status} />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>{classData.teacher[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{classData.teacher}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{classData.date}</span>
                        </div>
                    </div>

                    <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={i < Math.floor(classData.rating) ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    className={`h-4 w-4 ${i < Math.floor(classData.rating) ? "text-yellow-500" : "text-muted-foreground"}`}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ))}
                            <span className="ml-1">{classData.rating}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button asChild>
                                <Link href={`/dashboard/classes/${classData.id}`}>View Details</Link>
                            </Button>
                            <Button variant="outline">Certificate</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function StatusBadge({ status }) {
    const variants = {
        active: { variant: "default" as const, label: "Active" },
        full: { variant: "secondary" as const, label: "Full" },
        completed: { variant: "outline" as const, label: "Completed" },
        cancelled: { variant: "destructive" as const, label: "Cancelled" },
    }

    const { variant, label } = variants[status] || variants.active

    return <Badge variant={variant}>{label}</Badge>
}
