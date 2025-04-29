"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Mail, Edit } from "lucide-react"
import { useGet } from "@/hooks/use-fetch"

export default function ProfilePage() {

  const { id } = useParams() as { id: string };
  const endpoint = id === "me" ? "/auth/me" : `/user/${id}`
  const { fetch: data, loading, error } = useGet(endpoint);

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
    } else {
      if (data) {
        console.log('User data:', data);
      }
      if (error) {
        console.error('Error fetching user:', error);
      }
    }
  }, [data, error, loading]);

  const user = {
    username: data?.username ?? '',
    name: data?.name ?? '',
    email: data?.email ?? '',
    role: data?.user_type_name ?? '',
    avatar: data?.profile_pic ?? '',
    bio: "Student passionate about mathematics and languages.",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    github: data?.username ?? '',
    twitter: data?.username ?? '',
    joined: "May 2023",
    classes: {
      enrolled: 5,
      completed: 12,
    },
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
                    <div className="text-sm text-muted-foreground">Full Name</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.name}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.email}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Bio</div>
                  <div className="bg-white text-sm font-body font-thin text-stone-900 p-3 rounded-sm shadow-[inset_0px_1px_2px_0px_rgba(0,_0,_0,_0.1)]">{user.bio}</div>
                </div>
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
                <span className="text-muted-foreground">Enrolled Classes</span>
                <span className="font-medium">{user.classes.enrolled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed Classes</span>
                <span className="font-medium">{user.classes.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Classes</span>
                <span className="font-medium">{user.classes.enrolled + user.classes.completed}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="enrolled">
            <TabsList className="mb-4">
              <TabsTrigger value="enrolled">Currently Enrolled</TabsTrigger>
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
    </div >
  )
}

interface ClassHistoryListProps {
  type: "enrolled" | "completed"
}

function ClassHistoryList({ type }: ClassHistoryListProps) {
  // Sample class data
  const enrolledClasses = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      teacher: "Dr. Smith",
      date: "Mondays, 9:00 - 10:30",
      progress: "3/8 sessions",
    },
    {
      id: 2,
      title: "Spanish for Beginners",
      teacher: "Ms. Garcia",
      date: "Wednesdays, 14:00 - 15:30",
      progress: "2/10 sessions",
    },
  ]

  const completedClasses = [
    {
      id: 3,
      title: "Basic Physics",
      teacher: "Prof. Johnson",
      date: "Completed on Apr 30, 2023",
      rating: 4.5,
    },
    {
      id: 4,
      title: "Introduction to Literature",
      teacher: "Dr. Williams",
      date: "Completed on Mar 15, 2023",
      rating: 5,
    },
  ]

  const classes = type === "enrolled" ? enrolledClasses : completedClasses

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No {type} classes found</div>
      ) : (
        classes.map((cls) => (
          <div
            key={cls.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b last:border-0"
          >
            <div>
              <h3 className="font-medium">{cls.title}</h3>
              <div className="text-sm text-muted-foreground">Instructor: {cls.teacher}</div>
              <div className="text-sm text-muted-foreground">{cls.date}</div>
            </div>

            <div className="flex items-center gap-4">
              {type === "enrolled" ? (
                <>
                  <div className="text-sm">{(cls as any).progress}</div>
                  <Button variant="outline" size="sm">
                    View Class
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{(cls as any).rating}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Certificate
                  </Button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

