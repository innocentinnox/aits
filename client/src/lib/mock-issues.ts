import type { Issue } from "@/types"

// Generate random dates within the last 3 months
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

const now = new Date()
const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

// Generate mock issues
export const mockIssues: Issue[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1
  const priority = Math.floor(Math.random() * 3) + 1 // 1, 2, or 3
  const statusOptions = ["open", "in_progress", "resolved", "closed"]
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

  // Updated assignee options to reflect university email addresses
  const assigneeOptions = [
    "prof.johnson@university.edu",
    "dr.smith@university.edu",
    "admin@university.edu",
    null
  ]
  const assigned_to = assigneeOptions[Math.floor(Math.random() * assigneeOptions.length)]

  // Updated creator options to be more representative of a university community
  const creatorOptions = ["student1", "student2", "faculty", "admin"]
  const created_by = creatorOptions[Math.floor(Math.random() * creatorOptions.length)]

  const created_at = randomDate(threeMonthsAgo, now)
  const updated_at = randomDate(new Date(created_at), now)

  const comments_count = Math.floor(Math.random() * 10)

  // Updated category options to common university issue areas
  const categoryOptions = [
    { id: 1, name: "Academic" },
    { id: 2, name: "Facilities" },
    { id: 3, name: "Administration" },
    { id: 4, name: "Financial" },
  ]
  const category = categoryOptions[Math.floor(Math.random() * categoryOptions.length)]

  // Updated title options for a university context
  const titleOptions = [
    "Curriculum Inquiry",
    "Exam Scheduling Issue",
    "Facility Maintenance Request",
    "Administrative Query"
  ]
  
  return {
    id,
    title: `Issue ${id}: ${titleOptions[Math.floor(Math.random() * titleOptions.length)]}`,
    description: `This issue (#${id}) relates to university affairs and addresses concerns raised by students or staff regarding academic policies, campus facilities, or administrative procedures.`,
    priority,
    category_id: category.id,
    category_name: category.name,
    status,
    assigned_to,
    created_by,
    created_at,
    updated_at,
    resolution_details:
      status === "resolved" || status === "closed"
        ? `The issue was resolved by coordinating with the relevant department to address the concern.`
        : null,
    college_id: Math.floor(Math.random() * 5) + 1,
    course_unit_id: Math.floor(Math.random() * 10) + 1,
    year_of_study: Math.floor(Math.random() * 4) + 1,
    comments_count,
  }
})