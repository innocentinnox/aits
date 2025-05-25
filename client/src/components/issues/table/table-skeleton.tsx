import { TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  rowCount: number
}

export default function TableSkeleton({ rowCount }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-[300px]" />
              <Skeleton className="h-3 w-full max-w-[200px]" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}