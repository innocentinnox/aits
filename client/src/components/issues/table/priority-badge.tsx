import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "":
      return <Badge className="bg-destructive">High</Badge>;
    case "pending":
      return (
        <Badge className="bg-warning text-warning-foreground uppercase">
          pending
        </Badge>
      );
    case "resolved":
      return <Badge className="bg-green-500 uppercase">resolved</Badge>;
    default:
      return null;
  }
}
