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
  executeGetToCreate: () => Promise<void>;
  subjects: any[]; // Evita usar 'any' si posible
}
import { useGet, usePost } from "@/hooks/use-fetch"
import Link from "next/link"


export default function TopicCreate({
  showNewTopicCreateDialog,
  setShowNewTopicCreateDialog,
  subjects,
  executeGetToCreate
}: TopicProps) {
  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { execute: postTopic } = usePost('/topic/create')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = {
        name,
        description,
        subject_id: Number(subjectId),
      }

      await postTopic(data)
      setShowNewTopicCreateDialog(false)
      setName('')
      setDescription('')
      setSubjectId('')
      await executeGetToCreate()
      
    } catch (error) {
      console.error('Error creating topic:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={showNewTopicCreateDialog} onOpenChange={setShowNewTopicCreateDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Select 
                value={subjectId} 
                onValueChange={setSubjectId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}