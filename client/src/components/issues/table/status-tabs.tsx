import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusTabsProps {
  currentStatuses: string[]
  onStatusChange: (status: string[]) => void
  openCount: number
  closedCount?: number
}

const closedStatuses = ["closed", "rejected", "resolved"];
const openStatuses = ["pending", "forwarded", "in_progress"];

export default function StatusTabs({ currentStatuses, onStatusChange, openCount, closedCount }: StatusTabsProps) {
  return (
    <div className="flex border-b">
      <Button
        variant="ghost"
        className={cn(
          "rounded-none border-b-2 border-transparent px-4",
          openStatuses?.filter((status) => currentStatuses.includes(status)).length == openStatuses.length && "border-primary"
        )}
        onClick={() => onStatusChange(openStatuses)}
      >
        Open
        <Badge variant="outline" className="ml-2">
          {openCount}
        </Badge>
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "rounded-none border-b-2 border-transparent px-4",
          closedStatuses?.filter((status) => currentStatuses.includes(status)).length == closedStatuses.length && "border-primary"
        )}
        onClick={() => onStatusChange(closedStatuses)}
      >
        Closed
        {closedCount !== undefined && (
          <Badge variant="outline" className="ml-2">
            {closedCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}