"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useGet, usePut } from "@/hooks/use-fetch"


export default function AttendanceModal({ lessonId }) {

    const { fetch: dataAssistance, loading, error } = useGet(`/attend/${lessonId}`);
    const { fetch: postAttends, loading: loadingPutAttends, error:errorPutAttends, execute: executePutAttends} = usePut(`/attend/class_attends/${lessonId}`);

    const [refactoredAttend, setRefactoredAttend] = useState({})
    
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>(new Date())
    const [attendanceData, setAttendanceData] = useState([])

    interface AssistanceRecord {
        user_id: number;
        student_name: string;
        assistance: boolean;
    }

    useEffect(() => {
            const transformedData = dataAssistance?.attends.map(
                (item: AssistanceRecord) => ({
                    id: item.user_id,
                    name: item.student_name,
                    status: item.assistance ? "present" : "absent"
                })
            );
            setAttendanceData(transformedData);
    }, [dataAssistance]);


    const updateAttendance = (id: number, status: string) => {
        setAttendanceData(attendanceData.map((student) => (student.id === id ? { ...student, status } : student)))
    }

    // {
    //     "user_id": 29,
    //     "student_name": "Joshua Campbell",
    //     "assistance": true,
    //     "lesson_id": 17
    // }

    const saveAttendance = () => {
        // In a real app, you would save the attendance data to your backend here

        const formatedToUsePost = attendanceData.map(e=> {
            return {
                student_id: e.id,
                student_name: e.name,
                assistance: e.status =="present" ? true : false,
                lesson_id: lessonId
            }
        })
        executePutAttends(formatedToUsePost)
        setOpen(false)
    }

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Attendance
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Mark Attendance</DialogTitle>
                        <DialogDescription>Record student attendance for this class session</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="space-y-2 flex-1">
                                <label>Session Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(date, "PPP")}
                                        </Button>
                                    </PopoverTrigger>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label>Quick Actions</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setAttendanceData(attendanceData.map((student) => ({ ...student, status: "present" })))
                                        }
                                    >
                                        Mark All Present
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setAttendanceData(attendanceData.map((student) => ({ ...student, status: "absent" })))
                                        }
                                    >
                                        Mark All Absent
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <div className="sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 font-medium border-b bg-background">
                                <div>Student</div>
                                <div></div>
                                <div>Status</div>
                            </div>

                            {attendanceData?.map((student) => (
                                <div
                                    key={student.id}
                                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 border-b last:border-0"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>{student.name}</div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`present-${student.id}`}
                                                checked={student.status === "present"}
                                                onCheckedChange={() => updateAttendance(student.id, "present")}
                                            />
                                            <label htmlFor={`present-${student.id}`} className="text-sm font-normal">
                                                Present
                                            </label>
                                        </div>
                                        {/* <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`late-${student.id}`}
                                                checked={student.status === "late"}
                                                onCheckedChange={() => updateAttendance(student.id, "late")}
                                            />
                                            <label htmlFor={`late-${student.id}`} className="text-sm font-normal">
                                                Late
                                            </label>
                                        </div> */}
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`absent-${student.id}`}
                                                checked={student.status === "absent"}
                                                onCheckedChange={() => updateAttendance(student.id, "absent")}
                                            />
                                            <label htmlFor={`absent-${student.id}`} className="text-sm font-normal">
                                                Absent
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveAttendance}>Save Attendance</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
