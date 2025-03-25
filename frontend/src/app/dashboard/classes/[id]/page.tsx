"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowLeft, Edit, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the class details based on the ID
  const classDetails = {
    id: params.id,
    title: "Introduction to Mathematics",
    description:
      "This course covers the fundamentals of mathematics including algebra, geometry, and basic calculus. Perfect for beginners or those looking to refresh their knowledge.",
    date: "Monday, May 15, 2023",
    time: "09:00 - 10:30",
    location: "Room 101, Main Building",
    teacher: {
      name: "Dr. Smith",
      avatar: "/placeholder.svg",
      bio: "Mathematics professor with 15 years of teaching experience.",
    },
    enrolled: 12,
    capacity: 15,
    status: "enrolled", // or 'available', 'full'
    price: 10, // credits
    materials: [
      { name: "Course Syllabus", type: "pdf" },
      { name: "Practice Problems", type: "pdf" },
    ],
    rating: 4.7,
    reviews: 24,
  }

  // Determine if the current user is a teacher (in a real app, this would come from auth)
  const isTeacher = false

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Class Details</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{classDetails.title}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{classDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{classDetails.time}</span>
                    </div>
                  </div>
                </CardDescription>
              </div>

              <StatusBadge status={classDetails.status as "enrolled" | "available" | "full"} />
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{classDetails.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{classDetails.location}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Class Materials</h3>
                <ul className="space-y-2">
                  {classDetails.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs uppercase">{material.type}</span>
                      </div>
                      <span>{material.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{classDetails.rating}</span>
                <span className="text-muted-foreground">({classDetails.reviews} reviews)</span>
              </div>

              {isTeacher ? (
                <Button className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Class
                </Button>
              ) : classDetails.status === "enrolled" ? (
                <Button variant="outline">Cancel Enrollment</Button>
              ) : (
                <Button disabled={classDetails.status === "full"}>Enroll ({classDetails.price} credits)</Button>
              )}
            </CardFooter>
          </Card>

          {isTeacher && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>Manage student attendance for this class</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceList />
              </CardContent>
            </Card>
          )}
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
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">Beginner</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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

function AttendanceList() {
  // Sample student data
  const students = [
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg", status: "present" },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg", status: "absent" },
    { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg", status: "present" },
    { id: 4, name: "Diana Prince", avatar: "/placeholder.svg", status: "late" },
    { id: 5, name: "Edward Cullen", avatar: "/placeholder.svg", status: "present" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{students.length} students enrolled</div>
        <Button size="sm">Export List</Button>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 font-medium border-b">
          <div>Student</div>
          <div></div>
          <div>Status</div>
        </div>

        {students.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 border-b last:border-0"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
            <div>{student.name}</div>
            <select className="border rounded px-2 py-1 text-sm" defaultValue={student.status}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

