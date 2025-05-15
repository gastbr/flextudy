"use client"

import type React from "react"
import { useState, use, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, ArrowLeft, Edit, Star, Users, BookOpen, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useProvider } from "@/app/context/provider"
import { useGet, usePost, useDelete } from "@/hooks/use-fetch"
import ClassEdit from "@/components/organisms/ClassEdit"
import AttendanceModal from "@/components/organisms/AttendanceModal"


export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params); // Usamos el alias

  const [activeTab, setActiveTab] = useState("overview")
  const [classDetails, setClassDetails] = useState(null)
  const [showEditClassDialog, setShowEditClassDialog] = useState(false)

  const { state } = useProvider()
  const user = useState(state?.currentUser)
  const isTeacher = user[0]?.user_type_name == "teacher" ? true : false
  const { execute: enrollAPI } = usePost(`/attend/${id}`);
  const { execute: cancelEnrollmentAPI } = useDelete(`/attend/${id}`);
  const { fetch: data, error, execute: excuteGetClassById } = useGet(`/classes/class/${id}`);


  const handleEnroll = async () => {
    try {
      await enrollAPI();
      setClassDetails((prev) => {
        const updatedDetails = {
          ...prev,
          student_enrolled: true,
          enrolled: prev.enrolled + 1,
        };
        console.log("Updated classDetails after enroll:", updatedDetails);
        return updatedDetails;
      });
    } catch (error) {
      console.error("Error enrolling in class:", error);
    }
  };

  const handleCancelEnrollment = async () => {
    try {
      await cancelEnrollmentAPI();
      await excuteGetClassById();
      setClassDetails((prev) => {
        const updatedDetails = {
          ...prev,
          student_enrolled: false,
          enrolled: prev.enrolled - 1,
        };
        console.log("Updated classDetails after cancel:", updatedDetails);
        return updatedDetails;
      });
    } catch (error) {
      console.error("Error canceling enrollment:", error);
    }
  };

  function toLocaleDateString(date: string) {
    const newDate = new Date(date)
    return newDate
  }

  useEffect(() => {
    if (data) {
      const c = data.class
      setClassDetails({
        id: c.id,
        title: c.title,
        subject: c.subject,
        topic_id: c.topic_id,
        description: c.description,
        longDescription: c.description,
        start_time: toLocaleDateString(c.start_time),
        end_time: toLocaleDateString(c.end_time),
        date: c.date,
        time: c.time,
        duration: calculateDuration(c.start_time, c.end_time),
        location: c.location,
        teacher: {
          name: c.teacher,
        },
        enrolled: c.enrolled,
        capacity: c.capacity,
        status: c.status, // or 'available', 'full', 'completed'
        ...(c.student_enrolled !== undefined && { student_enrolled: c.student_enrolled }),
        ...(c.teacher_owns_lesson !== undefined && { teacher_owns_lesson: c.teacher_owns_lesson })
      })

    } else if (error) {
      console.error("Error fetching class details:", error)
    }
  }, [data, error])


  function calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMilliseconds = end.getTime() - start.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // Redondear a 1 decimal y mostrar como "1.5 hours"
    return `${Math.round(diffInHours * 10) / 10} hours`;
  }

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
          <h2 className="text-3xl font-bold">{classDetails && classDetails.title}</h2>
          <Badge variant="outline" className="mt-2">
            {classDetails && classDetails.subject}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {isTeacher && classDetails?.teacher_owns_lesson ? (
            <>
              <Button className="gap-2" asChild>
                <Link href={``} onClick={() => setShowEditClassDialog(true)}>
                  <Edit className="h-4 w-4" />
                  Edit Class
                </Link>
              </Button>
              <AttendanceModal lessonId={classDetails.id} />
            </>
          ) : classDetails && classDetails?.student_enrolled ? (
            <Button variant="outline" onClick={handleCancelEnrollment}>Cancel Enrollment</Button>
          ) : (
            !isTeacher && (
              <Button disabled={classDetails?.status === "full"} onClick={handleEnroll}>
                {classDetails?.status === "full" ? "Class is full" : "Enroll"}
              </Button>
            )
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails && classDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails && classDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{classDetails && classDetails.location}</span>
                    </div>
                    {isTeacher && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {classDetails && classDetails.enrolled}/{classDetails && classDetails.capacity} students
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">Description</h3>
                    <div className="text-muted-foreground whitespace-pre-line">{classDetails && classDetails.longDescription}</div>
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
                <AvatarImage src={classDetails && classDetails.teacher.avatar} alt={classDetails && classDetails.teacher.name} />
                <AvatarFallback>{classDetails && classDetails.teacher.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{classDetails && classDetails.teacher.name}</h3>
              {/* <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">
                  {classDetails && classDetails.teacher.rating} ({classDetails && classDetails.teacher.reviews} reviews)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{classDetails && classDetails.teacher.bio}</p>
              <Button variant="outline" className="mt-4 w-full">
                View Profile
              </Button> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTeacher &&
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Enrolled</span>
                  <span className="font-medium">
                    {classDetails && classDetails.enrolled}/{classDetails && classDetails.capacity}
                  </span>
                </div>
              }
              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">{classDetails && classDetails.price} credits</span>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium"> {classDetails && classDetails.duration}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ClassEdit
        showEditClassDialog={showEditClassDialog}
        setShowEditClassDialog={setShowEditClassDialog}
        classDetails={classDetails}
        excuteGetClassById={excuteGetClassById}
      />

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