import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePut } from "@/hooks/use-fetch"

interface TopicProps {
  showNewTopicEditDialog: boolean;
  setShowNewTopicEditDialog: (show: boolean) => void;
  subjects: any[]; // Evita usar 'any' si posible,
  topic: {
    "name": string,
    "subject_id": number,
    "description": string,
    "id": number,
    "teacher_id": number
  };
  executeGetToCreate: () => Promise<void>;
}


export default function TopicEdit({
  showNewTopicEditDialog,
  setShowNewTopicEditDialog,
  subjects,
  topic,
  executeGetToCreate
}: TopicProps) {

  const [name, setName] = useState(topic.name)
  const [subject_id, setSubjectId] = useState(topic.subject_id)
  const [description, setDescription] = useState(topic.description)
  const id = topic.id
  const { fetch: userType, execute: executeEditTopic } = usePut(`/topic/edit/${id}`);

  useEffect(() => {
    setName(topic.name)
    setSubjectId(topic.subject_id)
    setDescription(topic.description)
  }, [topic])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const editTopic = {
      name: name,
      subject_id: subject_id,
      description: description,
      id: topic.id,
      teacher_id: topic.teacher_id
    };

    await executeEditTopic(editTopic) 
    await executeGetToCreate()
    setShowNewTopicEditDialog(false)
  };


  return (
    <>
      {topic && (
        <Dialog open={showNewTopicEditDialog} onOpenChange={setShowNewTopicEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Topic</DialogTitle>
              <DialogDescription>Edit topic for your classes</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input id="topicTitle" value={name ? name : topic.name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topicSubject">Subject</Label>
                <div className="flex gap-2">
                  <Select defaultValue={topic.subject_id} onValueChange={(value) => setSubjectId(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>

                    {subjects ? (
                      <SelectContent>
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
                <Textarea id="topicDescription" value={description ? description : topic.description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTopicEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={(e) => handleSubmit(e)}>Edit Topic</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

