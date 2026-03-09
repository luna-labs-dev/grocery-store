import * as React from "react"
import { useMediaQuery } from "@mantine/hooks"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

interface ResponsiveDataViewProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  MobileCard: React.ComponentType<{ data: TData }>
  keyExtractor?: (item: TData) => React.Key
  emptyMessage?: string
}

export function ResponsiveDataView<TData, TValue>({
  data,
  columns,
  MobileCard,
  keyExtractor = (item: any) => item.id || Math.random().toString(),
  emptyMessage = "Nenhum dado encontrado.",
}: ResponsiveDataViewProps<TData, TValue>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  if (isDesktop) {
    return (
      <DataTable 
        columns={columns} 
        data={data} 
        showPagination={false} // Always hide DataTable's internal pagination when using ResponsiveDataView via Page.Footer
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 pb-safe">
      {data.map((item) => (
        <MobileCard key={keyExtractor(item)} data={item} />
      ))}
    </div>
  )
}
