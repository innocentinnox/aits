import { Check, ClipboardCheck, Forward, MessageSquare } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils"; // Move the formatDate function to utils
import PriorityBadge from "./priority-badge";
import { useMutation } from "@tanstack/react-query";
import { issueService } from "@/services";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import Modal from "@/components/ui/Modal";
import IssueDetailsForm from "../IssueDetailsForm";
import { useResolveForward } from "@/admin/hooks/useResolveForward";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
interface IssueRowProps {
  issue: {
    id: number;
    token: string;
    title: string;
    description: string;
    status: string;
    priority: number;
    category: number;
    college: number;
    course: number;
    course_unit: number;
    semester: number;
    year_of_study: number;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
    resolution_details: string | null;
    created_by: User;
    assigned_to: User;
    modified_by: User | null;
    closed_by: User | null;
    forwarded_to: User | null;
    attachments: any[];
  };
}

export default function IssueRow({ issue }: IssueRowProps) {
  const { user } = useAuth();
  const { onResolve, isSubmittingIssue } = useResolveForward();
  return (
    <TableRow>
      <TableCell>
        <div className="flex h-6 w-6 items-center justify-center rounded-full border">
          <Check className="h-3 w-3" />
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{issue.title}</div>
        <div className="text-sm text-muted-foreground">
          {"Issued"} {formatDate(issue.created_at)}
          {""}
          {issue?.resolved_at
            ? ` | Resolved ${formatDate(issue.created_at)}`
            : null}
          {/* {formatDate(issue.created_at)} by {issue.created_by} */}
        </div>
      </TableCell>
      <TableCell>
        <PriorityBadge status={issue.status} />
      </TableCell>
      <TableCell>
        {/* {issue.assigned_to ? (
          <div className="flex items-center gap-2">
            <div className="h-6w-6rounded-full bg-primary/10" />
            <span className="text-sm capitalize">{issue.assigned_to.role}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )} */}
        <Modal>
          <Modal.Open opens="issue-details">
            <Button variant="outline" size="sm">
              View
            </Button>
          </Modal.Open>
          <Modal.Window name="issue-details">
            <IssueDetailsForm issue={issue} />
          </Modal.Window>
        </Modal>
      </TableCell>
      {/* For Admin */}
      {!(user?.role === "student") && !issue.resolved_at && (
        <TableCell className="text-right">
          <div className="flex items-center justify-end"></div>
          <div className="flex gap-2 cursor-pointer">
            <Button
              size="sm"
              disabled={isSubmittingIssue}
              onClick={() => onResolve(issue.token)}
            >
              Resolve
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
