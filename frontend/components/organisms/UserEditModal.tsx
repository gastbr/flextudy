import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePut } from "@/hooks/use-fetch";

interface EditUserDialogProps {
    user: {
        id: number;
        username: string;
        name: string;
        email: string;
        role: string;
        avatar: string;
        status: string;
        classes: number;
        joinDate: string;
    };
}

export default function UserEditModal({ user }: EditUserDialogProps) {
    const [editedUser, setEditedUser] = useState({
        username: user.username,
        name: user.name,
        email: user.email,
        profile_pic: user.avatar,
        status: user.status,
        user_type_name: user.role,
    });

    const { execute } = usePut(`/user/`);

    const handleInputChange = (field: string, value: string) => {
        setEditedUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = () => {
        execute(editedUser)
            .then((response) => {
                console.log("User updated: ", response);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error updating user: ", error);
            });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                    Edit user
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
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
                            <div className="text-sm text-muted-foreground">Joined 06-01-2023</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={editedUser.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editedUser.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <RadioGroup
                            value={editedUser.user_type_name}
                            onValueChange={(value) => handleInputChange("role", value)}
                        >
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
                        <Select
                            value={editedUser.status}
                            onValueChange={(value) => handleInputChange("status", value)}
                        >
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
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}