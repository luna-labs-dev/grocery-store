import { usePagination } from '@mantine/hooks';
import { ChevronDownIcon } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui';
import type { FetchListParams } from '@/domain';

interface PaginationProps<TFetchParams = FetchListParams> {
  paginationProps: {
    listTotal?: number;
    paginationParams: TFetchParams;
    setPaginationParams: (params: TFetchParams) => void;
  };
  totalItemsPerPageOptions?: number[];
}

export const CustomPagination = <TFetchParams,>({
  paginationProps: { listTotal, paginationParams, setPaginationParams },
  totalItemsPerPageOptions = [10, 20, 50],
}: PaginationProps<TFetchParams>) => {
  const currentSize =
    (paginationParams as unknown as FetchListParams).pageSize || 20;
  const total = listTotal ? Math.ceil(listTotal / currentSize) : 0;

  const { range, active, previous, next, setPage } = usePagination({
    total: total,
    initialPage: 1,
    boundaries: 1,
    siblings: 1,
    onChange: (page) => {
      setPaginationParams({
        ...paginationParams,
        pageIndex: page - 1,
      });
    },
  });

  const handleSizeChange = (newSize: number) => {
    setPaginationParams({
      ...paginationParams,
      pageSize: newSize,
      pageIndex: 0,
    });
  };

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-2 sm:flex-row sm:gap-4">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground w-full justify-center sm:justify-start">
        <span className="shrink-0">Itens por página</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 focus-visible:ring-0"
            >
              {currentSize}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-16">
            {totalItemsPerPageOptions.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => handleSizeChange(size)}
                className={size === currentSize ? 'bg-accent font-medium' : ''}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {listTotal !== undefined && (
          <div className="hidden text-sm text-muted-foreground sm:block ml-2 border-l pl-4 border-border">
            Total: {listTotal}
          </div>
        )}
      </div>

      <Pagination className="mx-0 w-full sm:w-auto flex justify-center sm:justify-end">
        <PaginationContent className="gap-0.5 sm:gap-1">
          {active > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={previous}
                className="cursor-pointer h-8 px-2 sm:h-10 sm:px-4 text-xs sm:text-sm"
              />
            </PaginationItem>
          )}
          {range.map((page, idx) => {
            if (page === 'dots') {
              return (
                <PaginationItem
                  key={`dots-${range[idx - 1]}-${range[idx + 1]}`}
                >
                  <PaginationEllipsis className="h-8 w-8 sm:h-10 sm:w-10" />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm"
                  isActive={active === page}
                  onClick={() => {
                    if (!Number.isNaN(page as number)) {
                      setPage(page as number);
                    }
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {active < total && (
            <PaginationItem>
              <PaginationNext
                onClick={next}
                className="cursor-pointer h-8 px-2 sm:h-10 sm:px-4 text-xs sm:text-sm"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
