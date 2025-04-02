import type { IssueParams, IssueResponse } from "@/types"
import { mockIssues } from "./mock-issues"

export async function fetchIssues(params: IssueParams): Promise<IssueResponse> {
  // Simulate API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Destructure params
  const { take = 10, skip = 0, search = "", priority = "", statuses = [], assigned_to = "", ordering = "" } = params

  // Filter issues based on params
  let filteredIssues = [...mockIssues]

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredIssues = filteredIssues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower) ||
        (issue.resolution_details && issue.resolution_details.toLowerCase().includes(searchLower)),
    )
  }

  // Apply priority filter
  if (priority) {
    filteredIssues = filteredIssues.filter((issue) => issue.priority === Number(priority))
  }

  // Apply status filter
  if (statuses.length > 0) {
    filteredIssues = filteredIssues.filter((issue) =>  statuses.includes(issue.status))
  }

  // Apply assignee filter
  if (assigned_to) {
    filteredIssues = filteredIssues.filter(
      (issue) => issue.assigned_to && issue.assigned_to.toLowerCase() === assigned_to.toLowerCase(),
    )
  }

  // Apply sorting
  if (ordering) {
    const isDesc = ordering.startsWith("-")
    const field = isDesc ? ordering.substring(1) : ordering

    filteredIssues.sort((a, b) => {
      let valueA: any = a[field as keyof typeof a]
      let valueB: any = b[field as keyof typeof b]

      // Handle string comparison
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
      }

      // Handle date comparison
      if (field === "created_at" || field === "updated_at") {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }

      if (valueA < valueB) return isDesc ? 1 : -1
      if (valueA > valueB) return isDesc ? -1 : 1
      return 0
    })
  }

  // Get total count before pagination
  const total = filteredIssues.length

  // Apply pagination
  const paginatedIssues = filteredIssues.slice(skip, skip + take)

  // Return response
  return {
    issues: paginatedIssues,
    total,
    take,
    skip,
  }
}

