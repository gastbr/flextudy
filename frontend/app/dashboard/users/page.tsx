"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Download, BarChart, BookOpen, CreditCard, Plus, UserPlus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useGet } from "@/hooks/use-fetch"

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
    status: string;
    classes: number;
    joinDate: string;
}

export default function UserManagementContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [showStatsDialog, setShowStatsDialog] = useState(false)
    const [showSubjectDialog, setShowSubjectDialog] = useState(false)
    const [showPricingDialog, setShowPricingDialog] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const { fetch: usersFetch, loading, error } = useGet('/user');

    useEffect(() => {
        if (loading) {
            console.log('Loading user data...');
        } else {
            if (usersFetch) {
                console.log('User data:', usersFetch);
                const transformedUsers = usersFetch.map((user: User & { profile_pic: string, user_type_name: string }) => ({
                    ...user,
                    role: user.user_type_name,
                    avatar: user.profile_pic,
                    status: user.status,
                    classes: 4,
                    joinDate: "2023-06-01",
                }));
                setUsers(transformedUsers);
            }
            if (error) {
                console.error('Error fetching user:', error);
            }
        }
    }, [usersFetch, error, loading]);

    // Filter users based on search query, status and role filter
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = filterRole === "all" || user.role === filterRole

        const matchesStatus = filterStatus === "all" || user.status === filterStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    // Sample statistics data
    const monthlyStats = {
        totalClasses: 45,
        totalStudents: 120,
        totalTeachers: 8,
        totalRevenue: 2450,
        averageClassSize: 12,
        classesPerTeacher: 5.6,
        topSubjects: [
            { name: "Mathematics", classes: 12, students: 45 },
            { name: "Languages", classes: 10, students: 38 },
            { name: "Physics", classes: 8, students: 22 },
        ],
        revenueByDay: [
            { day: "Mon", amount: 350 },
            { day: "Tue", amount: 420 },
            { day: "Wed", amount: 380 },
            { day: "Thu", amount: 450 },
            { day: "Fri", amount: 520 },
            { day: "Sat", amount: 280 },
            { day: "Sun", amount: 50 },
        ],
    }

    // Sample subjects data
    const subjects = [
        { id: "1", name: "Mathematics", description: "All math-related topics", classes: 12, active: true },
        { id: "2", name: "Languages", description: "Foreign language learning", classes: 10, active: true },
        { id: "3", name: "Physics", description: "Physical sciences", classes: 8, active: true },
        { id: "4", name: "Chemistry", description: "Chemical sciences", classes: 5, active: true },
        { id: "5", name: "History", description: "Historical studies", classes: 7, active: true },
        { id: "6", name: "Literature", description: "Literary studies", classes: 6, active: false },
    ]

    // Sample pricing packages
    const pricingPackages = [
        { id: "1", name: "Starter", credits: 20, price: 19.99, active: true },
        { id: "2", name: "Standard", credits: 50, price: 44.99, active: true },
        { id: "3", name: "Premium", credits: 100, price: 79.99, active: true },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage users, roles, and platform settings</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setShowStatsDialog(true)}>
                        <BarChart className="h-4 w-4" />
                        <span>Statistics</span>
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => setShowSubjectDialog(true)}>
                        <BookOpen className="h-4 w-4" />
                        <span>Subjects</span>
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => setShowPricingDialog(true)}>
                        <CreditCard className="h-4 w-4" />
                        <span>Pricing</span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-[200px]">
                    <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Filter by role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="student">Students</SelectItem>
                            <SelectItem value="teacher">Teachers</SelectItem>
                            <SelectItem value="admin">Administrators</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-[200px]">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Filter by role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending approval</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage user accounts and role assignments</CardDescription>
                    </div>
                    <Button><UserPlus /></Button>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[1fr_1fr_auto_auto_auto_auto] items-center gap-4 p-4 font-medium border-b">
                            <div>Name</div>
                            <div>Email</div>
                            <div className="hidden md:block">Role</div>
                            <div>Status</div>
                            <div>Classes</div>
                            <div></div>
                        </div>

                        {filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No users found</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[1fr_1fr_auto_auto_auto] md:grid-cols-[1fr_1fr_auto_auto_auto_auto] items-center gap-4 p-4 border-b last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>{user.name}</div>
                                    </div>
                                    <div className="text-muted-foreground truncate">{user.email}</div>
                                    <div className="hidden md:block">
                                        <RoleBadge role={user.role} />
                                    </div>
                                    <div>
                                        <StatusBadge status={user.status as "active" | "inactive" | "pending"} />
                                    </div>
                                    <div className="text-center">{user.classes}</div>
                                    <div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary" size="xs">
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit User</DialogTitle>
                                                    <DialogDescription>Update user information and role</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={user.avatar} alt={user.name} />
                                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">Joined {user.joinDate}</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">Full Name</Label>
                                                            <Input id="name" defaultValue={user.name} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input id="email" type="email" defaultValue={user.email} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Role</Label>
                                                        <RadioGroup defaultValue={user.role}>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="student" id="student" />
                                                                <Label htmlFor="student" className="font-normal">
                                                                    Student
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="teacher" id="teacher" />
                                                                <Label htmlFor="teacher" className="font-normal">
                                                                    Teacher
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="admin" id="admin" />
                                                                <Label htmlFor="admin" className="font-normal">
                                                                    Administrator
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Account Status</Label>
                                                        <Select defaultValue={user.status}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                                <SelectItem value="pending">Pending Approval</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline">Reset Password</Button>
                                                    <Button>Save Changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </CardFooter>
            </Card>

            {/* Monthly Statistics Dialog */}
            <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Monthly Statistics</DialogTitle>
                        <DialogDescription>Overview of platform activity and revenue for the current month</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm text-muted-foreground">Total Classes</div>
                                    <div className="text-3xl font-bold mt-1">{monthlyStats.totalClasses}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm text-muted-foreground">Total Students</div>
                                    <div className="text-3xl font-bold mt-1">{monthlyStats.totalStudents}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm text-muted-foreground">Total Teachers</div>
                                    <div className="text-3xl font-bold mt-1">{monthlyStats.totalTeachers}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                                    <div className="text-3xl font-bold mt-1">${monthlyStats.totalRevenue}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue by Day</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px] flex items-end gap-2">
                                        {monthlyStats.revenueByDay.map((day) => (
                                            <div key={day.day} className="relative flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-primary/90 rounded-t"
                                                    style={{
                                                        height: `${(day.amount / Math.max(...monthlyStats.revenueByDay.map((d) => d.amount))) * 180}px`,
                                                    }}
                                                ></div>
                                                <div className="text-xs mt-2">{day.day}</div>
                                                <div className="absolute bottom-[calc(100%+5px)] text-xs font-medium">${day.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Subjects</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {monthlyStats.topSubjects.map((subject) => (
                                            <div key={subject.name} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <div className="font-medium">{subject.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {subject.classes} classes, {subject.students} students
                                                    </div>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{
                                                            width: `${(subject.students / monthlyStats.totalStudents) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Average Class Size</div>
                                        <div className="text-xl font-medium mt-1">{monthlyStats.averageClassSize} students</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Classes per Teacher</div>
                                        <div className="text-xl font-medium mt-1">{monthlyStats.classesPerTeacher}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Average Revenue per Class</div>
                                        <div className="text-xl font-medium mt-1">
                                            ${(monthlyStats.totalRevenue / monthlyStats.totalClasses).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Average Revenue per Student</div>
                                        <div className="text-xl font-medium mt-1">
                                            ${(monthlyStats.totalRevenue / monthlyStats.totalStudents).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                        <Button onClick={() => setShowStatsDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subject Configuration Dialog */}
            <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Subject Configuration</DialogTitle>
                        <DialogDescription>Manage available subjects for classes</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                {subjects.filter((s) => s.active).length} active subjects
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Subject
                            </Button>
                        </div>

                        <div className="border rounded-md">
                            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-3 font-medium border-b">
                                <div>Subject</div>
                                <div>Classes</div>
                                <div>Status</div>
                                <div></div>
                            </div>

                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-3 border-b last:border-0"
                                >
                                    <div>
                                        <div className="font-medium">{subject.name}</div>
                                        <div className="text-sm text-muted-foreground">{subject.description}</div>
                                    </div>
                                    <div className="text-center">{subject.classes}</div>
                                    <div>
                                        <Switch checked={subject.active} />
                                    </div>
                                    <div>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowSubjectDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pricing Configuration Dialog */}
            <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Pricing Configuration</DialogTitle>
                        <DialogDescription>Manage credit packages and pricing</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                {pricingPackages.filter((p) => p.active).length} active packages
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Package
                            </Button>
                        </div>

                        <div className="border rounded-md">
                            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 p-3 font-medium border-b">
                                <div>Package</div>
                                <div>Credits</div>
                                <div>Price</div>
                                <div>Status</div>
                                <div></div>
                            </div>

                            {pricingPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 p-3 border-b last:border-0"
                                >
                                    <div className="font-medium">{pkg.name}</div>
                                    <div className="text-center">{pkg.credits}</div>
                                    <div className="text-center">${pkg.price.toFixed(2)}</div>
                                    <div>
                                        <Switch checked={pkg.active} />
                                    </div>
                                    <div>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Default Class Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="defaultCredits">Default Credits per Class</Label>
                                        <Input id="defaultCredits" type="number" defaultValue="10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minCredits">Minimum Credits per Class</Label>
                                        <Input id="minCredits" type="number" defaultValue="5" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="teacherPricing">Allow Teacher Custom Pricing</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Let teachers set their own credit prices for classes
                                        </div>
                                    </div>
                                    <Switch id="teacherPricing" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowPricingDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function RoleBadge({ role }: { role: string }) {
    const variants = {
        student: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Student" },
        teacher: { color: "bg-green-50 text-green-700 border-green-200", label: "Teacher" },
        admin: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Admin" },
    }

    const { color, label } = variants[role as keyof typeof variants] || variants.student

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            {label}
        </span>
    )
}

function StatusBadge({ status }: { status: "active" | "inactive" | "pending" }) {
    const variants = {
        active: { color: "bg-green-50 text-green-700 border-green-200", label: "Active" },
        inactive: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Inactive" },
        pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pending" },
    }

    const { color, label } = variants[status] || variants.active

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            {label}
        </span>
    )
}
