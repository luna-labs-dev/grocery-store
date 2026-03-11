import * as React from "react"
import { useMediaQuery } from "@mantine/hooks"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { cn } from "@/lib/utils"

interface ResponsiveDataViewProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  MobileCard: React.ComponentType<{ data: TData }>
  keyExtractor?: (item: TData) => React.Key
  emptyMessage?: string
  dense?: boolean
  className?: string
}

export function ResponsiveDataView<TData, TValue>({
  data,
  columns,
  MobileCard,
  keyExtractor = (item: any) => item.id || Math.random().toString(),
  emptyMessage = "Nenhum dado encontrado.",
  dense = false,
  className,
}: ResponsiveDataViewProps<TData, TValue>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!data || data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center text-muted-foreground", className)}>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  if (isDesktop) {
    return (
      <div className={cn("flex-1 min-h-0", className)}>
        <DataTable 
          columns={columns} 
          data={data} 
          showPagination={false} // Always hide DataTable's internal pagination when using ResponsiveDataView via Page.Footer
          dense={dense}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none md:scrollbar-default">
        <div className="flex flex-col gap-2 pb-safe">
          {data.map((item) => (
            <MobileCard key={keyExtractor(item)} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
