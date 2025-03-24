"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, MessageSquare, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { fetchIssues } from "@/lib/issues"
import type { Issue, IssueParams } from "@/types"
import { useNavigate } from "react-router-dom"
import useUrlParams from "@/hooks/use-url-params"

export default function IssueTable() {
  const navigate = useNavigate();
  const { searchParams } = useUrlParams();
  const [isLoading, setIsLoading] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState<IssueParams>({
    take: 10,
    skip: 0,
    search: "",
    priority: "",
    status: "",
    assigned_to: "",
    ordering: "",
  })

  // Get current params from URL
  useEffect(() => {
    const currentParams: IssueParams = {
      take: Number(searchParams.get("take")) || 10,
      skip: Number(searchParams.get("skip")) || 0,
      search: searchParams.get("search") || "",
      priority: searchParams.get("priority") || "",
      status: searchParams.get("status") || "",
      assigned_to: searchParams.get("assigned_to") || "",
      ordering: searchParams.get("ordering") || "",
    }
    setParams(currentParams)
  }, [searchParams])

  // Fetch issues when params change
  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true)
      try {
        const response = await fetchIssues(params)
        setIssues(response.issues)
        setTotal(response.total)
      } catch (error) {
        console.error("Failed to fetch issues:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIssues()
  }, [params])

  // Update URL with new params
  const updateParams = (newParams: Partial<IssueParams>) => {
    const updatedParams = { ...params, ...newParams }

    // Reset skip to 0 when filters change
    if (
      newParams.search !== undefined ||
      newParams.priority !== undefined ||
      newParams.status !== undefined ||
      newParams.assigned_to !== undefined ||
      newParams.ordering !== undefined
    ) {
      updatedParams.skip = 0
    }

    const url = new URLSearchParams()

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        url.set(key, String(value))
      }
    })

    navigate(`?${url.toString()}`)
  }

  // Calculate pagination
  const totalPages = Math.ceil(total / params.take)
  const currentPage = Math.floor(params.skip / params.take) + 1

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    // Always show first page
    pages.push(1)

    // Calculate range of pages to show around current page
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2)

    // Adjust if we're near the beginning
    if (startPage > 2) {
      pages.push("ellipsis")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Adjust if we're near the end
    if (endPage < totalPages - 1) {
      pages.push("ellipsis")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Handle page change
  const goToPage = (page: number) => {
    updateParams({ skip: (page - 1) * params.take })
  }

  // Clear all filters
  const clearFilters = () => {
    updateParams({
      search: "",
      priority: "",
      status: "",
      assigned_to: "",
      skip: 0,
    })
  }

  // Render priority badge
  const renderPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return <Badge className="bg-destructive">High</Badge>
      case 2:
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
      case 3:
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return null
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      return "today"
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else if (diffDays <= 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-8"
            value={params.search}
            onChange={(e) => updateParams({ search: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                Priority
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateParams({ priority: "1" })}>
                <Check className={cn("mr-2 h-4 w-4", params.priority === "1" ? "opacity-100" : "opacity-0")} />
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateParams({ priority: "2" })}>
                <Check className={cn("mr-2 h-4 w-4", params.priority === "2" ? "opacity-100" : "opacity-0")} />
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateParams({ priority: "3" })}>
                <Check className={cn("mr-2 h-4 w-4", params.priority === "3" ? "opacity-100" : "opacity-0")} />
                Low
              </DropdownMenuItem>
              {params.priority && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updateParams({ priority: "" })}>Clear filter</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateParams({ status: "open" })}>
                <Check className={cn("mr-2 h-4 w-4", params.status === "open" ? "opacity-100" : "opacity-0")} />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateParams({ status: "in_progress" })}>
                <Check className={cn("mr-2 h-4 w-4", params.status === "in_progress" ? "opacity-100" : "opacity-0")} />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateParams({ status: "resolved" })}>
                <Check className={cn("mr-2 h-4 w-4", params.status === "resolved" ? "opacity-100" : "opacity-0")} />
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateParams({ status: "closed" })}>
                <Check className={cn("mr-2 h-4 w-4", params.status === "closed" ? "opacity-100" : "opacity-0")} />
                Closed
              </DropdownMenuItem>
              {params.status && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updateParams({ status: "" })}>Clear filter</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                Assignee
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by assignee</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => updateParams({ assigned_to: "john.doe@example.com" })}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      params.assigned_to === "john.doe@example.com" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  John Doe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams({ assigned_to: "jane.smith@example.com" })}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      params.assigned_to === "jane.smith@example.com" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Jane Smith
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams({ assigned_to: "alex.johnson@example.com" })}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      params.assigned_to === "alex.johnson@example.com" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Alex Johnson
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {params.assigned_to && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => updateParams({ assigned_to: "" })}>Clear filter</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={params.ordering} onValueChange={(value) => updateParams({ ordering: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority (Low to High)</SelectItem>
              <SelectItem value="-priority">Priority (High to Low)</SelectItem>
              <SelectItem value="created_at">Date (Oldest first)</SelectItem>
              <SelectItem value="-created_at">Date (Newest first)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="-title">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {(params.search || params.priority || params.status || params.assigned_to) && (
            <Button variant="ghost" onClick={clearFilters} className="h-10 px-3">
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex border-b">
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 border-transparent px-4",
            params.status !== "closed" && "border-primary",
          )}
          onClick={() => updateParams({ status: "" })}
        >
          Open
          <Badge variant="outline" className="ml-2">
            {total}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 border-transparent px-4",
            params.status === "closed" && "border-primary",
          )}
          onClick={() => updateParams({ status: "closed" })}
        >
          Closed
        </Button>
      </div>

      {/* Issues table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Issue</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[150px]">Assignee</TableHead>
              <TableHead className="w-[100px] text-right">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: params.take }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-3 w-full max-w-[200px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : issues.length > 0 ? (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                      <Check className="h-3 w-3" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-muted-foreground">
                      #{issue.id} • {issue.status === "closed" ? "closed" : "opened"} {formatDate(issue.created_at)} by{" "}
                      {issue.created_by}
                    </div>
                  </TableCell>
                  <TableCell>{renderPriorityBadge(issue.priority)}</TableCell>
                  <TableCell>
                    {issue.assigned_to ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10" />
                        <span className="text-sm">{issue.assigned_to.split("@")[0]}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <MessageSquare className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{issue.comments_count}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No issues found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {params.skip + 1}-{Math.min(params.skip + params.take, total)} of {total} issues
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>

            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(Number(page))}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>

            <Select
              value={params.take.toString()}
              onValueChange={(value) => updateParams({ take: Number(value), skip: 0 })}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

