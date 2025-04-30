"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Mail, Phone, MapPin, GitlabIcon as GitHub, Twitter, CheckSquare } from "lucide-react"
import { useGet, usePatch } from "@/hooks/use-fetch"
// @ts-ignore

export default function ProfilePage() {

  const { fetch: fetchMe, loading, error } = useGet('/auth/me');

  const { execute: patchUser } = usePatch(`/user/${fetchMe?.id}`);
  const user = {
    username: fetchMe?.username ?? '',
    name: fetchMe?.name ?? '',
    email: fetchMe?.email ?? '',
    role: fetchMe?.user_type_name ?? '',
    avatar: fetchMe?.profile_pic ?? '',
    bio: "Student passionate about mathematics and languages.",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    github: fetchMe?.username ?? '',
    twitter: fetchMe?.username ?? '',
    joined: "May 2023",
    classes: {
      enrolled: 5,
      completed: 12,
    },
  }
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);


  function handleSubmit() {

    const post = {
      name: name,
      email: email
    }

    patchUser(post)
      .then((response) => {
        console.log("posted:", response);
      })
      .catch((err) => {
        console.error("post failed:", err);
      });
  }

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
    } else {
      if (fetchMe) {
        setUsername(fetchMe?.username);
        setName(fetchMe?.name);
        setEmail(fetchMe?.email);

      }
      if (error) {
        console.error('Error fetching user:', error);
      }
    }
  }, [fetchMe, error, loading]);




  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit profile</h1>
          <p className="text-muted-foreground">Edit your profile information</p>
        </div>

        <Link href="/dashboard/profile/me">
          <Button className="flex items-center gap-2" onClick={() => handleSubmit()}>
            <CheckSquare className="h-4 w-4" />
            <span>Confirm</span>
          </Button>
        </Link>

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
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" disabled defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={user.bio} readOnly rows={3} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={user.phone} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={user.location} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Username</Label>
                <Input id="github" defaultValue={user.github} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Username</Label>
                <Input id="twitter" defaultValue={user.twitter} readOnly />
              </div>
            </div>
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
              {user.phone && (
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
              )}
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
    </div>
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

