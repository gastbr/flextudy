"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Search, Plus, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


export default function Classes({ classData }) {

    

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
                            {/* <Link>   */}
                            <a href={classData.location}>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Url</span>
                                </div>
                            </a>
                            {/* </Link> */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                    {classData.enrolled}/{classData.capacity} students
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-48">
                        <div className="flex items-center gap-1">
                        {/* {Array.from({ length: 5 }).map((_, i) => (
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
                          <span className="ml-1">{classData.rating}</span> */}
                        </div>

                        <div className="flex flex-col gap-2 align-middle">
                            <Button asChild>
                                <Link href={`/dashboard/classes/${classData.id}`}>View Details</Link>
                            </Button>
                            {/* <Button variant="outline">Certificate</Button> */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function StatusBadge({ status }) {
    const variants = {
        avaliable: { variant: "default" as const, label: "Avaliable" },
        full: { variant: "secondary" as const, label: "Full" },
        completed: { variant: "outline" as const, label: "Completed" },
        cancelled: { variant: "destructive" as const, label: "Cancelled" },
    }

    const { variant, label } = variants[status] || variants.avaliable

    return <Badge variant={variant}>{label}</Badge>
}
