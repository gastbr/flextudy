import { requireRole } from "@/lib/auth"
import UserManagementContent from "./user-management-content"

export default async function UserManagementPage() {
  // This ensures only admins can access this page
  // await requireRole("admin")

  return <UserManagementContent />
}

