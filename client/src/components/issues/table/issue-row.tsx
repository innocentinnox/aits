import { Check, ClipboardCheck, Forward, MessageSquare } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils"; // Move the formatDate function to utils
import PriorityBadge from "./priority-badge";
import { useMutation } from "@tanstack/react-query";
import { issueService } from "@/services";
import { toast } from "sonner";

interface IssueRowProps {
  issue: {
    id: string | number;
    title: string;
    priority: number;
    status: string;
    created_at: string;
    created_by: string;
    assigned_to: string | null;
    comments_count: number;
    token: string;
  };
}

export default function IssueRow({ issue }: IssueRowProps) {
  const { mutate: onResolve, isPending: submittingIssue } = useMutation({
    mutationFn: (token: string) => issueService.resolve(token),
    onError: (error) => {
      toast.error(error.message || "Failed to resolve issue");
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message || "Issue resolved successfully");
    },
  });
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
          #{issue.id} • {"Issued"} {formatDate(issue.created_at)}
          {/* {formatDate(issue.created_at)} by {issue.created_by} */}
        </div>
      </TableCell>
      <TableCell>
        <PriorityBadge status={issue.status} />
      </TableCell>
      <TableCell>
        {issue.assigned_to ? (
          <div className="flex items-center gap-2">
            <div className="h-6w-6rounded-full bg-primary/10" />
            <span className="text-sm capitalize">{issue.assigned_to.role}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end"></div>
        <div className="flex gap-2 cursor-pointer">
          <Forward color="#333" />
          <ClipboardCheck color="#333" onClick={() => onResolve(issue.token)} />
        </div>
      </TableCell>
    </TableRow>
  );
}
