import { Icon } from '@iconify/react';
import { usePagination } from '@mantine/hooks';
import { Button } from '../ui';
import type { FetchListParams } from '@/domain';
import { cn } from '@/lib/utils';

interface PaginationProps<TFetchParams = FetchListParams> {
  paginationProps: {
    listTotal?: number;
    paginationParams: TFetchParams;
    setPaginationParams: (params: TFetchParams) => void;
    isFetching: boolean;
  };
}

export const CustomPagination = <TFetchParams,>({
  paginationProps: {
    listTotal,
    paginationParams,
    setPaginationParams,
    isFetching,
  },
}: PaginationProps<TFetchParams>) => {
  const total = listTotal
    ? Math.ceil(listTotal / (paginationParams as FetchListParams).pageSize)
    : 0;

  const pagination = usePagination({
    total: total,
    initialPage: 1,
    onChange: (page) => {
      setPaginationParams({
        ...paginationParams,
        pageIndex: page - 1,
      });
    },
  });

  return (
    <div className="flex justify-between pb-2 md:gap-2 md:justify-end">
      <div className="flex gap-2">
        <Button
          disabled={isFetching || pagination.active === 1}
          onClick={pagination.previous}
        >
          <Icon icon="mingcute:left-line" />
        </Button>
        <Button
          disabled={isFetching || pagination.active === total}
          onClick={pagination.next}
        >
          <Icon icon="mingcute:right-line" />
        </Button>
      </div>
      <div className="flex">
        {pagination.range.map((page) => {
          return (
            <div key={page as number} className={'flex items-center'}>
              <span
                onClick={() => {
                  if (!Number.isNaN(page as number)) {
                    pagination.setPage(page as number);
                  }
                }}
                onKeyUp={() => {}}
                className={cn(
                  pagination.active === page
                    ? 'bg-primary text-white rounded-md'
                    : '',
                  'px-[.6rem] py-[.2rem]',
                )}
              >
                {Number.isNaN(page as number) ? '...' : page}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
