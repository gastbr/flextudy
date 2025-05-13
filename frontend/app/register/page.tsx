"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { usePost } from "@/hooks/use-fetch"
import { redirect } from "next/navigation"

export default function RegisterPage() {

  const[name, setName] = useState("");
  const[userName, setUserName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[rol, setRol] = useState("student");

  const { execute } = usePost('/user');
  
  function handleSubmit(){
    const user = {
      name: name,
      username: userName,
      email: email,
      password: password,
      role: rol
    }
    execute(user);
    redirect("/login");
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-8">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">FLEXTUDY</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John" onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">User name</Label>
              <Input id="lastName" placeholder="Doe" onChange={(e)=>setUserName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label>Account type</Label>
            <RadioGroup defaultValue="student" className="flex flex-col space-y-1"   onValueChange={setRol} >
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
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="font-normal">
                  Administrator
                </Label>
              </div> */}
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-1">
              Note: Teacher accounts require approval
                
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full">Create Account</Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

