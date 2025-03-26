import { requireRole } from "@/lib/auth"
import CreateClassContent from "./create-class-content"

export default async function CreateClassPage() {
  // This ensures only teachers and admins can access this page
  await requireRole(["teacher", "admin"])

  return <CreateClassContent />
}

