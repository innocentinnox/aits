import { Badge } from "@/components/ui/badge"

interface PriorityBadgeProps {
  priority: number
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
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