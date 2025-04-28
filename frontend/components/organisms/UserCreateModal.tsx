import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ShieldIcon } from "lucide-react"
import { usePost } from "@/hooks/use-fetch"

interface UserCreateModalProps {
    newUser: {
        name: string;
        email: string;
        role: string;
    };
    setNewUser: React.Dispatch<React.SetStateAction<{
        name: string;
        email: string;
        role: string;
    }>>;
}


export default function UserCreateModal({ newUser, setNewUser }: UserCreateModalProps) {
    const { execute: postUser } = usePost('/user');

    const handleSubmit = (post: { name: string, email: string, role: string }) => {
        postUser(post)
            .then((response) => {
                console.log("posted:", response);
            })
            .catch((err) => {
                console.error("post failed:", err);
            });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon"><UserPlus /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new user</DialogTitle>
                    <DialogDescription>Add a new user to the platform</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" placeholder="John Doe" className="col-span-3" value={newUser.name}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                name: e.target.value
                            }))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" placeholder="email@example.com" className="col-span-3" value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                email: e.target.value
                            }))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select
                            onValueChange={(value) => setNewUser(prev => ({
                                ...prev,
                                role: value
                            }))}
                        >
                            <SelectTrigger className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <ShieldIcon className="h-4 w-4" />
                                    <SelectValue placeholder="Select a role" />
                                </div>
                            </SelectTrigger>
                            <SelectContent id="role">
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <div>Test: {newUser.name}, {newUser.email}, {newUser.role} </div>
                    <Button onClick={() => handleSubmit(newUser)}><UserPlus />Create user</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}