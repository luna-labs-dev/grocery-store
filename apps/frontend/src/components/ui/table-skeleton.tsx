import { Skeleton } from "./skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table"

interface TableSkeletonProps {
  columnCount: number
  rowCount?: number
  showHeader?: boolean
}

export function TableSkeleton({
  columnCount,
  rowCount = 5,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={`header-${i}`}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={`row-${i}`} className="h-12">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell key={`cell-${i}-${j}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
