import { Check, Forward, MoreHorizontal, Eye, Settings, ChevronDown } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import Modal from "@/components/ui/Modal";
import IssueDetailsForm from "../IssueDetailsForm";
import IssueResolveForm from "../IssueResolveForm";
import IssueForwardForm from "../IssueForwardForm";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface RegistrarIssueRowProps {
    issue: {
        id: number;
        token: string;
        title: string;
        description: string;
        status: string;
        priority: number;
        category?: {
            id: number;
            name: string;
        };
        created_at: string;
        updated_at: string;
        resolved_at: string | null;
        resolution_details: string | null;
        created_by: {
            id: number;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
        };
        assigned_to?: {
            id: number;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
        };
        forwarded_to?: {
            id: number;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
        };
        [key: string]: any;
    };
}

export default function RegistrarIssueRow({ issue }: RegistrarIssueRowProps) {
    const { user } = useAuth();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "forwarded":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-purple-100 text-purple-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            case "closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 4:
                return "bg-red-100 text-red-800";
            case 3:
                return "bg-orange-100 text-orange-800";
            case 2:
                return "bg-yellow-100 text-yellow-800";
            case 1:
            default:
                return "bg-green-100 text-green-800";
        }
    };

    const getPriorityText = (priority: number) => {
        switch (priority) {
            case 4:
                return "Critical";
            case 3:
                return "High";
            case 2:
                return "Medium";
            case 1:
            default:
                return "Low";
        }
    };

    const getCreatedByName = () => {
        const { created_by } = issue;
        if (created_by?.first_name && created_by?.last_name) {
            return `${created_by.first_name} ${created_by.last_name}`;
        }
        return created_by?.username || "Unknown";
    };

    return (
        <TableRow className="hover:bg-muted/50">
            <TableCell>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                    <Check className="h-3 w-3" />
                </div>
            </TableCell>
            <TableCell>
                <div className="max-w-md">
                    <div className="font-medium text-sm">{issue.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {issue.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Token: {issue.token}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        issue.status
                    )}`}
                >
                    {issue.status.replace("_", " ").toUpperCase()}
                </span>
            </TableCell>
            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        issue.priority
                    )}`}
                >
                    {getPriorityText(issue.priority)}
                </span>
            </TableCell>
            <TableCell>
                <div className="text-sm">{getCreatedByName()}</div>
            </TableCell>
            <TableCell>
                <div className="text-sm">{formatDate(issue.created_at)}</div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                    {/* View Button - Always visible */}
                    <Modal>
                        <Modal.Open opens={`view-issue-${issue.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View
                            </Button>
                        </Modal.Open>
                        <Modal.Window name={`view-issue-${issue.id}`}>
                            <IssueDetailsForm issue={{
                                ...issue,
                                category: issue.category?.id || 0,
                                college: issue.college || 0,
                                course: issue.course || 0,
                                course_unit: issue.course_unit || 0,
                                semester: issue.semester || 0,
                                year_of_study: issue.year_of_study || 0,
                                assigned_to: issue.assigned_to || {
                                    id: 0,
                                    username: 'unassigned',
                                    email: '',
                                    first_name: 'Unassigned',
                                    last_name: ''
                                },
                                modified_by: issue.modified_by || null,
                                closed_by: issue.closed_by || null,
                                forwarded_to: issue.forwarded_to || null,
                                attachments: issue.attachments || []
                            }} />
                        </Modal.Window>
                    </Modal>

                    {/* Forward Modal - Only for pending issues */}
                    {issue.status === "pending" && (
                        <Modal>
                            <Modal.Open opens={`forward-issue-${issue.id}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Forward className="h-4 w-4" />
                                    Forward
                                </Button>
                            </Modal.Open>
                            <Modal.Window name={`forward-issue-${issue.id}`}>
                                <IssueForwardForm issue={{
                                    ...issue,
                                    category: issue.category?.id || 0,
                                    college: issue.college || 0,
                                    course: issue.course || 0,
                                    course_unit: issue.course_unit || 0,
                                    semester: issue.semester || 0,
                                    year_of_study: issue.year_of_study || 0,
                                    assigned_to: issue.assigned_to || {
                                        id: 0,
                                        username: 'unassigned',
                                        email: '',
                                        first_name: 'Unassigned',
                                        last_name: ''
                                    },
                                    modified_by: issue.modified_by || null,
                                    closed_by: issue.closed_by || null,
                                    forwarded_to: issue.forwarded_to || null,
                                    attachments: issue.attachments || []
                                }} onCloseModal={() => { }} />
                            </Modal.Window>
                        </Modal>
                    )}

                    {/* Resolve Modal - Always available for unresolved issues */}
                    {user?.role === "registrar" && issue.status !== "resolved" && (
                        <Modal>
                            <Modal.Open opens={`resolve-issue-${issue.id}`}>
                                <Button size="sm" className="flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    Resolve
                                </Button>
                            </Modal.Open>
                            <Modal.Window name={`resolve-issue-${issue.id}`}>
                                <IssueResolveForm issue={{
                                    ...issue,
                                    category: issue.category?.id || 0,
                                    college: issue.college || 0,
                                    course: issue.course || 0,
                                    course_unit: issue.course_unit || 0,
                                    semester: issue.semester || 0,
                                    year_of_study: issue.year_of_study || 0,
                                    assigned_to: issue.assigned_to || {
                                        id: 0,
                                        username: 'unassigned',
                                        email: '',
                                        first_name: 'Unassigned',
                                        last_name: ''
                                    },
                                    modified_by: issue.modified_by || null,
                                    closed_by: issue.closed_by || null,
                                    forwarded_to: issue.forwarded_to || null,
                                    attachments: issue.attachments || []
                                }} onCloseModal={() => { }} />
                            </Modal.Window>
                        </Modal>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
