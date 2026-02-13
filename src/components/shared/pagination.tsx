import { usePagination } from '@mantine/hooks';
import {
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
}

export const CustomPagination = <TFetchParams,>({
  paginationProps: { listTotal, paginationParams, setPaginationParams },
}: PaginationProps<TFetchParams>) => {
  const total = listTotal
    ? Math.ceil(listTotal / (paginationParams as FetchListParams).pageSize)
    : 0;

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

  return (
    <Pagination>
      <PaginationContent>
        {active > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={previous} className="cursor-pointer" />
          </PaginationItem>
        )}
        {range.map((page, idx) => {
          if (page === 'dots') {
            return (
              <PaginationItem key={`dots-${range[idx - 1]}-${range[idx + 1]}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
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
            <PaginationNext onClick={next} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
