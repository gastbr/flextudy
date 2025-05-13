"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, ArrowLeft, Edit, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProvider } from "@/app/context/provider";
import { useGet } from "@/hooks/use-fetch";
import ClassEdit from "@/components/organisms/ClassEdit";
import AttendanceModal from "@/components/organisms/AttendanceModal";

// Helper Functions
function toLocaleDateString(date: string) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
}

function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMilliseconds = end.getTime() - start.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return `${Math.round(diffInHours * 10) / 10} hours`;
}

// Types
interface ClassDetails {
  id: string;
  title: string;
  subject: string;
  topic_id: string;
  description: string;
  longDescription: string;
  start_time: string;
  end_time: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  teacher: {
    name: string;
    avatar?: string;
  };
  enrolled: number;
  capacity: number;
  status: string;
  student_enrolled?: boolean;
  teacher_owns_lesson?: boolean;
}

export default function ClassDetailPage() {
  const { id } = useParams() as { id: string };
  const { state } = useProvider();
  const user = state?.currentUser;
  const isTeacher = user?.user_type_name === "teacher";

  const endpoint = `/classes/class/${id}`;
  const { fetch: classData, loading, error } = useGet(endpoint);

  const classDetails: ClassDetails | null = classData
    ? {
      id: classData.class.id,
      title: classData.class.title,
      subject: classData.class.subject,
      topic_id: classData.class.topic_id,
      description: classData.class.description,
      longDescription: classData.class.description,
      start_time: toLocaleDateString(classData.class.start_time),
      end_time: toLocaleDateString(classData.class.end_time),
      date: classData.class.date,
      time: classData.class.time,
      duration: calculateDuration(classData.class.start_time, classData.class.end_time),
      location: classData.class.location,
      teacher: { name: classData.class.teacher },
      enrolled: classData.class.enrolled,
      capacity: classData.class.capacity,
      status: classData.class.status,
      ...(classData.class.student_enrolled !== undefined && {
        student_enrolled: classData.class.student_enrolled,
      }),
      ...(classData.class.teacher_owns_lesson !== undefined && {
        teacher_owns_lesson: classData.class.teacher_owns_lesson,
      }),
    }
    : null;

  useEffect(() => {
    if (loading) {
      console.log("Loading class data...");
    } else {
      if (classData) {
        console.log("Class data:", classData);
      }
      if (error) {
        console.error("Error fetching class data:", error);
      }
    }
  }, [classData, error, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading class details. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <Header />
      <ClassDetails
        classDetails={classDetails}
        isTeacher={isTeacher}
        setShowEditClassDialog={() => { }}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewCard
          classDetails={classDetails}
          activeTab="overview"
          setActiveTab={() => { }}
          isTeacher={isTeacher}
        />
        <div className="space-y-6">
          <TeacherCard teacher={classDetails?.teacher} />
          <ClassInfoCard classDetails={classDetails} isTeacher={isTeacher} />
        </div>
      </div>
      {isTeacher && (
        <ClassEdit
          showEditClassDialog={false}
          setShowEditClassDialog={() => { }}
          classDetails={classDetails}
          executeGetClassById={() => { }}
        />
      )}
    </div>
  );
}

// Subcomponents remain unchanged...

// Subcomponents
function Header() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/dashboard/classes">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">Class Details</h1>
    </div>
  );
}

function ClassDetails({ classDetails, isTeacher, setShowEditClassDialog }: any) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <h2 className="text-3xl font-bold">{classDetails?.title}</h2>
        <Badge variant="outline" className="mt-2">
          {classDetails?.subject}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {isTeacher && classDetails?.teacher_owns_lesson ? (
          <>
            <Button className="gap-2" asChild>
              <Link href="#" onClick={() => setShowEditClassDialog(true)}>
                <Edit className="h-4 w-4" />
                Edit Class
              </Link>
            </Button>
            <AttendanceModal lessonId={classDetails?.id} />
          </>
        ) : classDetails?.student_enrolled ? (
          <Button variant="outline">Cancel Enrollment</Button>
        ) : (
          !isTeacher && (
            <Button disabled={classDetails?.status === "full"}>Enroll</Button>
          )
        )}
      </div>
    </div>
  );
}

// Other subcomponents remain unchanged...

function OverviewCard({ classDetails, activeTab, setActiveTab, isTeacher }: any) {
  return (
    <div className="md:col-span-3">
      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DetailItem icon={Calendar} text={classDetails?.date} />
                <DetailItem icon={Clock} text={classDetails?.time} />
                <DetailItem icon={MapPin} text={classDetails?.location} />
                {isTeacher && (
                  <DetailItem
                    icon={Users}
                    text={`${classDetails?.enrolled}/${classDetails?.capacity} students`}
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Description</h3>
                <div className="text-muted-foreground whitespace-pre-line">
                  {classDetails?.longDescription}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherCard({ teacher }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={teacher?.avatar} alt={teacher?.name} />
          <AvatarFallback>{teacher?.name?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{teacher?.name}</h3>
      </CardContent>
    </Card>
  );
}

function ClassInfoCard({ classDetails, isTeacher }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isTeacher && (
          <InfoRow label="Enrolled" value={`${classDetails?.enrolled}/${classDetails?.capacity}`} />
        )}
        <InfoRow label="Duration" value={classDetails?.duration} />
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{text}</span>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}