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
import type { IssueParams } from "@/types";
import { useNavigate } from "react-router-dom";
import useUrlParams from "@/hooks/use-url-params";

// Import our new components
import FilterDropdown from "../../components/issues/table/filter-dropdown";
import TablePagination from "../../components/issues/table/table-pagination";
import TableSkeleton from "../../components/issues/table/table-skeleton";
import RegistrarIssueRow from "../../components/issues/table/registrar-issue-row";
import SearchBar from "../../components/issues/table/search-bar";
import StatusTabs from "../../components/issues/table/status-tabs";
import useRegistrarIssues from "../hooks/useRegistrarIssues";

export default function AdminIssueTable() {
  const navigate = useNavigate();
  const { searchParams } = useUrlParams();
  const [params, setParams] = useState<IssueParams>({
    take: 10,
    skip: 0,
    search: "",
    priority: "",
    category: "",
    statuses: [],
    assigned_to: "",
    year: "",
    semester: "",
    course: "",
    course_unit: "",
    created_after: "",
    created_before: "",
    ordering: "-created_at",
  });

  // Get current params from URL
  useEffect(() => {
    const currentParams: IssueParams = {
      take: Number(searchParams.get("take")) || 10,
      skip: Number(searchParams.get("skip")) || 0,
      search: searchParams.get("search") || "",
      priority: searchParams.get("priority") || "",
      category: searchParams.get("category") || "",
      statuses: searchParams.get("statuses")?.split(",").filter(Boolean) || [],
      assigned_to: searchParams.get("assigned_to") || "",
      year: searchParams.get("year") || "",
      semester: searchParams.get("semester") || "",
      course: searchParams.get("course") || "",
      course_unit: searchParams.get("course_unit") || "",
      created_after: searchParams.get("created_after") || "",
      created_before: searchParams.get("created_before") || "",
      ordering: searchParams.get("ordering") || "-created_at",
    };
    setParams(currentParams);
  }, [searchParams]);

  // Use the new registrar issues hook with pagination
  const { issuesData, totalCount, isLoadingIssues } = useRegistrarIssues(params);

  // Update URL with new params
  const updateParams = ({ statuses, ...newParams }: Partial<IssueParams>) => {
    let updatedParams = {
      ...params,
      ...newParams,
    };

    // Handle statuses array
    if (statuses !== undefined) {
      updatedParams.statuses = statuses;
    }

    // Reset skip to 0 when filters change (except for pagination)
    if (
      newParams.search !== undefined ||
      newParams.priority !== undefined ||
      newParams.category !== undefined ||
      (statuses !== undefined) ||
      newParams.assigned_to !== undefined ||
      newParams.year !== undefined ||
      newParams.semester !== undefined ||
      newParams.course !== undefined ||
      newParams.course_unit !== undefined ||
      newParams.created_after !== undefined ||
      newParams.created_before !== undefined ||
      newParams.ordering !== undefined
    ) {
      updatedParams.skip = 0;
    }

    const url = new URLSearchParams();

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "statuses" && Array.isArray(value)) {
          if (value.length > 0) {
            url.set(key, value.join(","));
          }
        } else {
          url.set(key, String(value));
        }
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
      category: "",
      statuses: [],
      assigned_to: "",
      year: "",
      semester: "",
      course: "",
      course_unit: "",
      created_after: "",
      created_before: "",
      skip: 0,
    });
  };

  // Define filter options
  const priorityOptions = [
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
    { value: "4", label: "Critical" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "forwarded", label: "Forwarded" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const categoryOptions = [
    { value: "1", label: "Academic" },
    { value: "2", label: "Technical" },
    { value: "3", label: "Administrative" },
  ];

  const yearOptions = [
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
  ];

  const semesterOptions = [
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Issues Dashboard</h1>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={params.search || ""}
          onChange={(value) => updateParams({ search: value })}
          placeholder="Search issues..."
        />

        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            title="Priority"
            options={priorityOptions}
            currentValue={params.priority || ""}
            onChange={(value) => updateParams({ priority: value })}
          />

          <FilterDropdown
            title="Category"
            options={categoryOptions}
            currentValue={params.category || ""}
            onChange={(value) => updateParams({ category: value })}
          />

          <FilterDropdown
            title="Year"
            options={yearOptions}
            currentValue={params.year || ""}
            onChange={(value) => updateParams({ year: value })}
          />

          <FilterDropdown
            title="Semester"
            options={semesterOptions}
            currentValue={params.semester || ""}
            onChange={(value) => updateParams({ semester: value })}
          />

          <Select
            value={params.ordering || "-created_at"}
            onValueChange={(value) => updateParams({ ordering: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">Newest First</SelectItem>
              <SelectItem value="created_at">Oldest First</SelectItem>
              <SelectItem value="-updated_at">Recently Updated</SelectItem>
              <SelectItem value="priority">Priority (Low to High)</SelectItem>
              <SelectItem value="-priority">Priority (High to Low)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="-title">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {(params.search ||
            params.priority ||
            params.category ||
            (params.statuses && params.statuses?.length > 0) ||
            params.assigned_to ||
            params.year ||
            params.semester ||
            params.course ||
            params.course_unit ||
            params.created_after ||
            params.created_before) && (
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
        openCount={totalCount}
      />

      {/* Issues table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Issue</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[150px]">Created By</TableHead>
              <TableHead className="w-[100px]">Created Date</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>            {isLoadingIssues ? (
            <TableSkeleton rowCount={params.take} />
          ) : issuesData.length > 0 ? (
            issuesData.map((issue: any, index: any) => (
              <RegistrarIssueRow key={issue.id || index} issue={issue} />
            ))
          ) : (
            <TableRow>
              <TableHead colSpan={7} className="h-24 text-center">
                No issues found matching your criteria.
              </TableHead>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <TablePagination
          total={totalCount}
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
