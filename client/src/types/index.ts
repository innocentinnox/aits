export interface Issue {
    id: number
    title: string
    description: string
    priority: number
    category_id: number
    category_name: string
    status: string
    assigned_to: string | null
    created_by: string
    created_at: string
    updated_at: string
    resolution_details: string | null
    college_id: number | null
    course_unit_id: number | null
    year_of_study: number | null
    comments_count: number
  }
  
  export interface IssueParams {
    take: number
    skip: number
    search?: string
    priority?: string
    category?: string
    assigned_to?: string
    college?: string
    course?: string
    course_unit?: string
    statuses?: string[]
    year?: string
    semester?: string
    created_after?: string
    created_before?: string
    ordering?: string
  }
  
  export interface IssueResponse {
    issues: Issue[]
    total: number
    take: number
    skip: number
  }
  
  