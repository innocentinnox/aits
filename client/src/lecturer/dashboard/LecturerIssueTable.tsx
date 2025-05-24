"use client";

import { useState, useEffect } from "react";
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
import type { Issue, IssueParams } from "@/types";
import { useNavigate } from "react-router-dom";
import useUrlParams from "@/hooks/use-url-params";

// Import reusable components
import FilterDropdown from "../../components/issues/table/filter-dropdown";
import TablePagination from "../../components/issues/table/table-pagination";
import TableSkeleton from "../../components/issues/table/table-skeleton";
import SearchBar from "../../components/issues/table/search-bar";
import StatusTabs from "../../components/issues/table/status-tabs";
import useLecturerIssues from "../hooks/useLecturerIssues";

export default function LecturerIssueTable() {
    const navigate = useNavigate();
    const { searchParams } = useUrlParams();
    const [params, setParams] = useState<IssueParams>({
        take: 10,
        skip: 0,
        search: "",
        priority: "",
        category: "",
        statuses: [], // Remove default status filter to show all issues
        year: "",
        ordering: "-created_at",
    });

    const [searchValue, setSearchValue] = useState("");

    // Update params from URL on mount and when URL changes
    useEffect(() => {
        const urlParams: IssueParams = {
            take: parseInt(searchParams.get("take") || "10"),
            skip: parseInt(searchParams.get("skip") || "0"),
            search: searchParams.get("search") || "",
            priority: searchParams.get("priority") || "",
            category: searchParams.get("category") || "",
            statuses: searchParams.get("statuses")?.split(",") || [],
            year: searchParams.get("year") || "",
            ordering: searchParams.get("ordering") || "-created_at",
        };
        setParams(urlParams);
        setSearchValue(urlParams.search || "");
    }, [searchParams]);

    const { issuesData, isLoadingIssues, totalCount } = useLecturerIssues(params);
    const issues = issuesData || [];

    const handleSearch = (value: string) => {
        setSearchValue(value);
        const url = new URL(window.location.href);
        if (value) {
            url.searchParams.set("search", value);
        } else {
            url.searchParams.delete("search");
        }
        url.searchParams.set("skip", "0");
        navigate(`${url.pathname}${url.search}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const url = new URL(window.location.href);
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
        url.searchParams.set("skip", "0");
        navigate(`${url.pathname}${url.search}`);
    };

    const handleStatusChange = (statuses: string[]) => {
        const url = new URL(window.location.href);
        if (statuses.length > 0) {
            url.searchParams.set("statuses", statuses.join(","));
        } else {
            url.searchParams.delete("statuses");
        }
        url.searchParams.set("skip", "0");
        navigate(`${url.pathname}${url.search}`);
    };

    const currentPage = Math.floor(params.skip / params.take) + 1;
    const openCount = issues.filter((issue: any) =>
        ["pending", "forwarded", "in_progress"].includes(issue.status)
    ).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Issues</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Export
                    </Button>
                </div>
            </div>

            {/* Status Tabs */}
            <StatusTabs
                currentStatuses={params.statuses || []}
                onStatusChange={handleStatusChange}
                openCount={openCount}
            />

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar
                        value={searchValue}
                        onChange={handleSearch}
                        placeholder="Search issues..."
                    />
                </div>

                <FilterDropdown
                    title="Priority"
                    currentValue={params.priority || ""}
                    onChange={(value) => handleFilterChange("priority", value)}
                    options={[
                        { value: "", label: "All Priorities" },
                        { value: "1", label: "Low" },
                        { value: "2", label: "Medium" },
                        { value: "3", label: "High" },
                        { value: "4", label: "Critical" },
                    ]}
                />

                <FilterDropdown
                    title="Category"
                    currentValue={params.category || ""}
                    onChange={(value) => handleFilterChange("category", value)}
                    options={[
                        { value: "", label: "All Categories" },
                        { value: "1", label: "Academic" },
                        { value: "2", label: "Technical" },
                        { value: "3", label: "Administrative" },
                    ]}
                />

                <FilterDropdown
                    title="Year of Study"
                    currentValue={params.year || ""}
                    onChange={(value) => handleFilterChange("year", value)}
                    options={[
                        { value: "", label: "All Years" },
                        { value: "1", label: "Year 1" },
                        { value: "2", label: "Year 2" },
                        { value: "3", label: "Year 3" },
                        { value: "4", label: "Year 4" },
                    ]}
                />

                <Select
                    value={params.ordering || "-created_at"}
                    onValueChange={(value) => handleFilterChange("ordering", value)}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created_at">Newest First</SelectItem>
                        <SelectItem value="created_at">Oldest First</SelectItem>
                        <SelectItem value="-updated_at">Recently Updated</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="-priority">Priority (High to Low)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Issues Table */}
            {isLoadingIssues ? (
                <TableSkeleton rowCount={params.take} />
            ) : issues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No issues found matching your criteria.
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Issue</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map((issue: any) => (
                                <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium">{issue.title}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                {issue.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            issue.status === 'forwarded' ? 'bg-blue-100 text-blue-800' :
                                                issue.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                                                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {issue.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${issue.priority === 4 ? 'bg-red-100 text-red-800' :
                                            issue.priority === 3 ? 'bg-orange-100 text-orange-800' :
                                                issue.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {issue.priority === 4 ? 'Critical' :
                                                issue.priority === 3 ? 'High' :
                                                    issue.priority === 2 ? 'Medium' : 'Low'}
                                        </span>
                                    </td>
                                    <td className="p-4">{issue.category_name || 'N/A'}</td>
                                    <td className="p-4">{issue.created_by}</td>
                                    <td className="p-4">
                                        {new Date(issue.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                            <Button size="sm">
                                                Resolve
                                            </Button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {totalCount > 0 && (
                <TablePagination
                    total={totalCount}
                    currentPage={currentPage}
                    pageSize={params.take}
                    skip={params.skip}
                    onPageChange={(page: number) => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("skip", ((page - 1) * params.take).toString());
                        navigate(`${url.pathname}${url.search}`);
                    }}
                    onPageSizeChange={(take: number) => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("take", take.toString());
                        url.searchParams.set("skip", "0");
                        navigate(`${url.pathname}${url.search}`);
                    }}
                />
            )}
        </div>
    );
}
