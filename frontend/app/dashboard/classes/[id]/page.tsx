"use client"

import type React from "react"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, ArrowLeft, Edit, Star, Users, BookOpen, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export default function ClassDetailPage() {
  const params = { id: "1" } // Simulating the useParams hook for demonstration purposes

  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch the class details based on the ID
  const classDetails = {
    id: 1,
    title: "Introduction to Mathematics",
    subject: "Mathematics",
    description:
      "This course covers the fundamentals of mathematics including algebra, geometry, and basic calculus. Perfect for beginners or those looking to refresh their knowledge.",
    longDescription: `
      This comprehensive course is designed to provide a solid foundation in mathematics. 
      
      We'll start with the basics of algebra, covering equations, inequalities, and functions. Then we'll move on to geometry, exploring shapes, angles, and spatial relationships. Finally, we'll introduce the fundamental concepts of calculus, including limits, derivatives, and integrals.
      
      Throughout the course, we'll focus on practical applications and problem-solving techniques that will help you apply these mathematical concepts in real-world situations.
    `,
    schedule: [
      { session: 1, topic: "Introduction to Algebra", date: "May 15, 2023", completed: true },
      { session: 2, topic: "Linear Equations", date: "May 22, 2023", completed: true },
      { session: 3, topic: "Quadratic Equations", date: "May 29, 2023", completed: true },
      { session: 4, topic: "Introduction to Geometry", date: "June 5, 2023", completed: false },
      { session: 5, topic: "Triangles and Circles", date: "June 12, 2023", completed: false },
      { session: 6, topic: 'Coordinate Geometry", date:  date: "June 12, 2023', completed: false },
      { session: 6, topic: "Coordinate Geometry", date: "June 19, 2023", completed: false },
      { session: 7, topic: "Introduction to Calculus", date: "June 26, 2023", completed: false },
      { session: 8, topic: "Limits and Derivatives", date: "July 3, 2023", completed: false },
    ],
    date: "Every Monday",
    time: "09:00 - 10:30",
    location: "Room 101, Main Building",
    teacher: {
      name: "Dr. Smith",
      avatar: "/placeholder.svg",
      bio: "Mathematics professor with 15 years of teaching experience.",
      rating: 4.8,
      reviews: 45,
    },
    enrolled: 12,
    capacity: 15,
    status: "active", // or 'available', 'full', 'completed'
    price: 10, // credits
    materials: [
      { name: "Course Syllabus", type: "pdf" },
      { name: "Practice Problems", type: "pdf" },
      { name: "Lecture Slides", type: "ppt" },
      { name: "Supplementary Reading", type: "pdf" },
    ],
    rating: 4.7,
    reviews: [
      {
        id: 1,
        user: "Alice Johnson",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "May 5, 2023",
        comment: "Excellent course! Dr. Smith explains complex concepts in a very understandable way.",
      },
      {
        id: 2,
        user: "Bob Williams",
        avatar: "/placeholder.svg",
        rating: 4,
        date: "May 3, 2023",
        comment: "Very helpful for beginners. The practice problems were particularly useful.",
      },
      {
        id: 3,
        user: "Carol Davis",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "April 28, 2023",
        comment: "Dr. Smith is an excellent teacher. I finally understand algebra thanks to this course!",
      },
    ],
    progress: 3, // sessions completed
    totalSessions: 8,
  }

  // Determine if the current user is a teacher (in a real app, this would come from auth)
  const isTeacher = true
  const isEnrolled = true

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Class Details</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold">{classDetails.title}</h2>
          <Badge variant="outline" className="mt-2">
            {classDetails.subject}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {isTeacher ? (
            <>
              <Button className="gap-2" asChild>
                <Link href={`/dashboard/classes/${params.id}/edit`}>
                  <Edit className="h-4 w-4" />
                  Edit Class
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/classes/${params.id}/attendance`}>Attendance</Link>
              </Button>
            </>
          ) : isEnrolled ? (
            <Button variant="outline">Cancel Enrollment</Button>
          ) : (
            <Button disabled={classDetails.status === "full"}>Enroll ({classDetails.price} credits)</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={classDetails.status} />
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{classDetails.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {classDetails.enrolled}/{classDetails.capacity} students
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">Description</h3>
                    <div className="text-muted-foreground whitespace-pre-line">{classDetails.longDescription}</div>
                  </div>

                  {isEnrolled && (
                    <div className="mt-6">
                      <h3 className="font-medium text-lg mb-2">Your Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {classDetails.progress}/{classDetails.totalSessions} sessions completed
                          </span>
                          <span>{Math.round((classDetails.progress / classDetails.totalSessions) * 100)}%</span>
                        </div>
                        <Progress value={(classDetails.progress / classDetails.totalSessions) * 100} />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Class Schedule</h3>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 font-medium border-b">
                        <div>Session</div>
                        <div>Topic</div>
                        <div>Date</div>
                      </div>

                      {classDetails.schedule.map((session) => (
                        <div
                          key={session.session}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 border-b last:border-0"
                        >
                          <div className="font-medium">{session.session}</div>
                          <div className="flex items-center gap-2">
                            {session.topic}
                            {session.completed && (
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{session.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Class Materials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classDetails.materials.map((material, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-center gap-4 p-4">
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{material.name}</div>
                                <div className="text-xs text-muted-foreground uppercase">{material.type}</div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">Student Reviews</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(classDetails.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted stroke-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{classDetails.rating}</span>
                        <span className="text-muted-foreground">({classDetails.reviews.length} reviews)</span>
                      </div>
                    </div>

                    {isEnrolled && (
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>Write a Review</CardTitle>
                          <CardDescription>Share your experience with this class</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="rating">Rating</Label>
                              <div className="flex items-center gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <button key={i} className="focus:outline-none">
                                    <Star className="h-6 w-6 text-muted stroke-muted-foreground hover:text-yellow-500 hover:fill-yellow-500" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comment">Comment</Label>
                              <Textarea id="comment" placeholder="Share your thoughts about this class..." rows={4} />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button>Submit Review</Button>
                        </CardFooter>
                      </Card>
                    )}

                    <div className="space-y-4">
                      {classDetails.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar} alt={review.user} />
                                <AvatarFallback>{review.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{review.user}</div>
                                  <div className="text-sm text-muted-foreground">{review.date}</div>
                                </div>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-muted stroke-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={classDetails.teacher.avatar} alt={classDetails.teacher.name} />
                <AvatarFallback>{classDetails.teacher.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{classDetails.teacher.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">
                  {classDetails.teacher.rating} ({classDetails.teacher.reviews} reviews)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{classDetails.teacher.bio}</p>
              <Button variant="outline" className="mt-4 w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Enrolled</span>
                <span className="font-medium">
                  {classDetails.enrolled}/{classDetails.capacity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">{classDetails.price} credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">1.5 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-medium">{classDetails.totalSessions}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Message Teacher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: "active" | "available" | "full" | "completed" | "cancelled"
}

function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    active: { variant: "default" as const, label: "Active" },
    available: { variant: "outline" as const, label: "Available" },
    full: { variant: "secondary" as const, label: "Full" },
    completed: { variant: "outline" as const, label: "Completed" },
    cancelled: { variant: "destructive" as const, label: "Cancelled" },
  }

  const { variant, label } = variants[status]

  return <Badge variant={variant}>{label}</Badge>
}

interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
}

function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
