import { Check, MessageSquare } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils"; // Move the formatDate function to utils
import PriorityBadge from "./priority-badge";

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
  };
}

export default function IssueRow({ issue }: IssueRowProps) {
  const {} = issue;
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
          #{issue.id} • {issue.status === "closed" ? "closed" : "opened"}{" "}
          {/* {formatDate(issue.created_at)} by {issue.created_by} */}
          {formatDate(issue.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={issue.priority} />
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
        <div className="flex items-center justify-end">
          <MessageSquare className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          <span>{issue.comments_count}</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
