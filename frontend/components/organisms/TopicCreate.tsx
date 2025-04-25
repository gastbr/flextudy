import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from 'next/router';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface TopicProps {
  showNewTopicCreateDialog: boolean;
  setShowNewTopicCreateDialog: (show: boolean) => void;
  execute: () => void;
  subjects: any[]; // Evita usar 'any' si posible
}
import { useGet, usePost } from "@/hooks/use-fetch"
import Link from "next/link"


export default function Topic({
  showNewTopicCreateDialog,
  setShowNewTopicCreateDialog,
  subjects,
  execute,
}: TopicProps) {

  const { fetch: userType, execute: postTopic } = usePost(`/topic/create`);
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  
  // {
  //   "name": "string",
  //   "description": "string",
  //   "subject_id": 0,
  //   "teacher_id": 0
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      description: description,
      subject_id: subjectId,
    }
    console.log('data', data)
    postTopic(data)
    execute()
    // setShowNewTopicCreateDialog(false)
  };

  return (
    <Dialog open={showNewTopicCreateDialog} onOpenChange={setShowNewTopicCreateDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogDescription>Add a new topic for your classes</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="topicTitle">Topic Title</Label>
          <Input id="topicTitle" placeholder="Enter topic title" onChange={(e)=>setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topicSubject">Subject</Label>
          <div className="flex gap-2">
            <Select onValueChange={(e) => setSubjectId(e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              
              {subjects ? (
              <SelectContent >
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            ) : null}
              
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topicDescription">Description</Label>
          <Textarea id="topicDescription" placeholder="Provide a description of this topic" rows={3} onChange={(e)=>setDescription(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline"  onClick={() => setShowNewTopicCreateDialog(false)}>
          Cancel
        </Button>
        <Button  onClick={handleSubmit}>Create Topic</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

