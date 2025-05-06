"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useProvider } from '@/app/context/provider'
import Classes from "@/components/organisms/Class"
import { useGet } from "@/hooks/use-fetch"
import { useEffect } from "react"


export default function MyClassesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterSubject, setFilterSubject] = useState("all")
    const [teachingClasses, setTeachingClasses] = useState([])
    const [enrolledClasses, setEnrolledClasses] = useState([])
    const [pastClasses, setPassClasses] = useState([])
    // AJUSTAR LA HORA, ME DA UNA HORA MENOS EN EL FRONT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const [dateNow , setDateNow] = useState(new Date().toISOString()) 
    

    const { state } = useProvider();
    if(dateNow.slice(-1)=="Z"){
        setDateNow(dateNow.replace("Z", "+00:00")) 
    }
    
    const { fetch: data, loading, error, execute:executeGetToCreate } = useGet('/classes/my_classes');
    useEffect(() => {
        if (data) {
            const now = new Date(); // Fecha actual como objeto Date
            
            // Clases futuras (no han empezado)
            setTeachingClasses(
                data.classes.filter((cls) => new Date(cls.start_time) > now)
            );

            setEnrolledClasses(
                data.classes.filter((cls) => new Date(cls.start_time) > now)
            );

            // Clases pasadas (ya empezaron)
            setPassClasses(
                data.classes.filter((cls) => new Date(cls.start_time) <= now)
            );
        } else if (error) {
            console.error('Error fetching user:', error);
        }
    }, [data, error]);


    const user = state?.flextudy.currentUser
    const userType = user?.user_type_name
    console.log("teachingClasses", data)



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
                {userType === "teacher" && <Button asChild className="flex items-center gap-2">
                    <Link href="/dashboard/classes/create">
                        <Plus className="h-4 w-4" />
                        <span>Create Class</span>
                    </Link>
                </Button>}

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
                    {userType === "teacher" && <TabsTrigger value="teaching">Teaching</TabsTrigger>}
                    {userType === "student" && <TabsTrigger value="enrolled">Enrolled</TabsTrigger>}
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
                                <Classes key={cls.id} classData={cls} />
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
                                <Classes key={cls.id} classData={cls} />
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
                                <Classes key={cls.id} classData={cls} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
