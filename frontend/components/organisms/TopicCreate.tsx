
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
interface TopicProps {
  showNewTopicCreateDialog: boolean;
  setShowNewTopicCreateDialog: (show: boolean) => void;
  subjects: any[]; // Evita usar 'any' si posible
}

export default function Topic({
  showNewTopicCreateDialog,
  setShowNewTopicCreateDialog,
  subjects
}: TopicProps) {
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
          <Input id="topicTitle" placeholder="Enter topic title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topicSubject">Subject</Label>
          <div className="flex gap-2">
            <Select >
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
          <Textarea id="topicDescription" placeholder="Provide a description of this topic" rows={3} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowNewTopicCreateDialog(false)}>
          Cancel
        </Button>
        <Button onClick={() => setShowNewTopicCreateDialog(false)}>Create Topic</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

