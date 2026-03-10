import * as React from "react"
import type {
    ColumnDef,
    SortingState,
} from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { ScrollArea, ScrollBar } from "./scroll-area"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  showPagination?: boolean
  paginationParams?: any
  setPaginationParams?: (params: any) => void
  total?: number
  dense?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showPagination = true,
  paginationParams,
  dense = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex: paginationParams?.pageIndex ?? 0,
        pageSize: paginationParams?.pageSize ?? 10,
      },
    },
  })

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="rounded-xl border bg-card min-h-0 flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 h-full w-full">
          <Table className={dense ? "[&_td]:py-2 [&_th]:py-2 relative" : "relative"}>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {showPagination && !paginationParams && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
