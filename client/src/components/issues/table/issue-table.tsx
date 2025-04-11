"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchIssues } from "@/lib/issues";
import type { Issue, IssueParams } from "@/types";
import { useNavigate } from "react-router-dom";
import useUrlParams from "@/hooks/use-url-params";

// Import our new components
import FilterDropdown from "./filter-dropdown";
import TablePagination from "./table-pagination";
import TableSkeleton from "./table-skeleton";
import IssueRow from "./issue-row";
import SearchBar from "./search-bar";
import StatusTabs from "./status-tabs";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";

export default function IssueTable() {
  const navigate = useNavigate();
  const { searchParams } = useUrlParams();
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<IssueParams>({
    take: 10,
    skip: 0,
    search: "",
    priority: "",
    statuses: [],
    assigned_to: "",
    ordering: "",
  });

  // Get current params from URL
  useEffect(() => {
    const currentParams: IssueParams = {
      take: Number(searchParams.get("take")) || 10,
      skip: Number(searchParams.get("skip")) || 0,
      search: searchParams.get("search") || "",
      priority: searchParams.get("priority") || "",
      statuses: searchParams.get("statuses")?.split(",") || [],
      assigned_to: searchParams.get("assigned_to") || "",
      ordering: searchParams.get("ordering") || "",
    };
    setParams(currentParams);
  }, [searchParams]);

  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryFn: () =>
      axiosInstance.get("/issues/list/", {
        params: { ...params, statuses: params.statuses?.join(",") },
      }),
    queryKey: ["issues", searchParams.toString()],
  });
  //robertt
  const TEMP_ISSUES = issuesData?.data.issues;

  // Fetch issues when params change
  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true);
      try {
        const response = await fetchIssues(params);

        setIssues(response.issues);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [params]);

  // Update URL with new params
  const updateParams = ({ statuses, ...newParams }: Partial<IssueParams>) => {
    let updatedParams = {
      ...params,
      ...newParams,
      statuses: statuses?.join(","),
    };
    statuses &&
      statuses?.length > 0 &&
      (updatedParams.statuses = statuses.join(","));

    // Reset skip to 0 when filters change
    if (
      newParams.search !== undefined ||
      newParams.priority !== undefined ||
      (statuses !== undefined && statuses.length > 0) ||
      newParams.assigned_to !== undefined ||
      newParams.ordering !== undefined
    ) {
      updatedParams.skip = 0;
    }

    const url = new URLSearchParams();

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        url.set(key, String(value));
      }
    });

    navigate(`?${url.toString()}`);
  };

  // Calculate pagination
  const currentPage = Math.floor(params.skip / params.take) + 1;

  // Handle page change
  const goToPage = (page: number) => {
    updateParams({ skip: (page - 1) * params.take });
  };

  // Clear all filters
  const clearFilters = () => {
    updateParams({
      search: "",
      priority: "",
      statuses: [],
      assigned_to: "",
      skip: 0,
    });
  };

  // Define filter options
  const priorityOptions = [
    { value: "1", label: "High" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Low" },
  ];

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const assigneeOptions = [
    { value: "john.doe@example.com", label: "John Doe" },
    { value: "jane.smith@example.com", label: "Jane Smith" },
    { value: "alex.johnson@example.com", label: "Alex Johnson" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={params.search}
          onChange={(value) => updateParams({ search: value })}
          placeholder="Search issues..."
        />

        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            title="Priority"
            options={priorityOptions}
            currentValue={params.priority}
            onChange={(value) => updateParams({ priority: value })}
          />

          <FilterDropdown
            title="Status"
            options={statusOptions}
            currentValue={
              params.statuses?.length == 1 ? params.statuses[0] : ""
            }
            onChange={(value) => updateParams({ statuses: [value] })}
          />

          <FilterDropdown
            title="Assignee"
            options={assigneeOptions}
            currentValue={params.assigned_to}
            onChange={(value) => updateParams({ assigned_to: value })}
            groupOptions={true}
            width="w-56"
          />

          <Select
            value={params.ordering}
            onValueChange={(value) => updateParams({ ordering: value })}
          >
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

          {(params.search ||
            params.priority ||
            (params.statuses && params.statuses?.length > 0) ||
            params.assigned_to) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-10 px-3"
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <StatusTabs
        currentStatuses={params.statuses || []}
        onStatusChange={(statuses) => updateParams({ statuses })}
        openCount={total}
      />

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
            {isLoadingIssues ? (
              <TableSkeleton rowCount={params.take} />
            ) : TEMP_ISSUES.length > 0 ? (
              TEMP_ISSUES.map((issue, index) => (
                <IssueRow key={index} issue={issue} />
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={5} className="h-24 text-center">
                  No issues found.
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <TablePagination
          total={total}
          currentPage={currentPage}
          pageSize={params.take}
          skip={params.skip}
          onPageChange={goToPage}
          onPageSizeChange={(size) => updateParams({ take: size, skip: 0 })}
        />
      )}
    </div>
  );
}
