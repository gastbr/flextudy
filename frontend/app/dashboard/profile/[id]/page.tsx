"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Mail, Edit } from "lucide-react"
import { useGet } from "@/hooks/use-fetch"
import { useProvider } from '@/app/context/provider'
import ClassHistoryList from "@/components/molecules/ClassHistoryList"

export default function ProfilePage() {

  const { id } = useParams() as { id: string };
  const endpoint = id === "me" ? "/auth/me" : `/user?username=${id}`
  const { fetch: data, loading, error } = useGet(endpoint);
  const { fetch: fetchClasses, loading: loadingClasses, error: errorClasses, execute: executeGetToCreate } = useGet('/classes/my_classes');

  const { state } = useProvider();
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [userClasses, setUserClasses] = useState<any>(null);
  const [completedClasses, setCompletedClasses] = useState([])
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const isTeacher = userType === "teacher" ;
  const [countedEnroled, setCountedEnroled] = useState([])
  const [countedCompleted, setCountedCompleted] = useState([])



// console.log("userType", userClasses)
  useEffect(() => {
    try {
      if (data && fetchClasses) {
        setUserData(data.data[0]);
        setUserType(data.data[0].user_type_name);
        setUserClasses(fetchClasses.classes);
      }
    } catch (error) {
      if (error) {
        console.error('Error fetching user:', error);
      }
    }
  }, [data, fetchClasses, error, loading]);

  useEffect(() => {
    const now = new Date();

    const enrolled = [];
    const completed = [];

    if (!userClasses) return;
    userClasses.forEach(cls => {
      const start = new Date(cls.start_time);
      const end = new Date(cls.end_time);

      const dayOfWeek = start.toLocaleDateString("en-US", { weekday: "long" });
      const formattedDate = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (end < now) {
        completed.push({
          id: cls.id,
          title: cls.title,
          teacher: cls.teacher_name,
          teacherUsername: cls.teacher_username,
          date: `Completed on ${cls.date}`,
          // rating: Math.floor(Math.random() * 2) + 4, // Simulado
        });
      } else {
        enrolled.push({
          id: cls.id,
          title: cls.title,
          teacher_name: cls.teacher_name,
          teacher_username: cls.teacher_username,
          date: `${cls.date}, ${cls.time}`, // ej: "Friday, 14:00 - 15:00"
          progress: `${cls.enrolled}/${cls.capacity} sessions`,
        });
      }
    });
    setCountedEnroled(enrolled.length);
    setCountedCompleted(completed.length);
    setEnrolledClasses(enrolled);
    setCompletedClasses(completed);

    

  }, [userClasses]);

  const user = {
    username: data?.data?.[0]?.username ?? '',
    name: data?.data?.[0]?.name ?? '',
    email: data?.data?.[0]?.email ?? '',
    role: data?.data?.[0]?.user_type_name ?? '',
    avatar: data?.data?.[0]?.profile_pic ?? '',
    // bio: "Student passionate about mathematics and languages.",
    // phone: "+1 (555) 123-4567",
    // location: "New York, NY",
    // github: data?.data?.[0]?.username ?? '',
    // twitter: data?.data?.[0]?.username ?? '',
    // joined: "May 2023",
    classes: {
      enrolled: 5,
      completed: 12,
    },
  }

  if (loading || loadingClasses) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">View your profile information</p>
        </div>

        {id === "me" &&
          <Link href="/dashboard/profile/edit">
            <Button className="flex items-center gap-2" variant={"ghost"}>
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        }

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col justify-center items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Username</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.username}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Role</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.role.toUpperCase()}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Full Name</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.email}</div>
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Bio</div>
                  <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.bio}</div>
                </div> */}
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phone number</div>
                <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.phone}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.location}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Github</div>
                <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.github}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Twiiter</div>
                <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.twitter}</div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {user.joined}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {/*               {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}
              {user.github && (
                <div className="flex items-center gap-2">
                  <GitHub className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.github}</span>
                </div>
              )}
              {user.twitter && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.twitter}</span>
                </div>
              )} */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{isTeacher ? "Teaching": "Enrolled"} Classes</span>
                <span className="font-medium">{countedEnroled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Classes</span>
                <span className="font-medium">{countedCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Classes</span>
                <span className="font-medium">{countedEnroled + countedCompleted}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 
      const [completedClasses, setCompletedClasses] = useState([])
      const [enrolledClasses, setEnrolledClasses] = useState([]) */}


      {
        userType && userType !== "admin" && userClasses && (
          <Card>
            <CardHeader>
              <CardTitle>Class History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enrolled">
                <TabsList className="mb-4">
                  <TabsTrigger value="enrolled">
                    {userType === "teacher" ? "Currently Teaching" : "Currently Enrolled"}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="enrolled">
                  <ClassHistoryList type="enrolled" classes={enrolledClasses} userType={userType}/>
                </TabsContent>
                <TabsContent value="completed">
                  <ClassHistoryList type="completed" classes={completedClasses} userType={userType} completed={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )
      }

      {/* 
      {
        userType && userType != "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>Class History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enrolled">
                <TabsList className="mb-4">
                  <TabsTrigger value="enrolled">{userType == "teacher" ? "Currently Teaching" : "Currently Enrolled"}</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="enrolled">
                  <ClassHistoryList type="enrolled" />
                </TabsContent>
                <TabsContent value="completed">
                  <ClassHistoryList type="completed" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )
      } */}

    </div >
  )
}


