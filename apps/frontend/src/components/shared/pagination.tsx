import { Icon } from '@iconify/react';
import { useMediaQuery, usePagination } from '@mantine/hooks';
import { ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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

  const isMobile = useMediaQuery('(max-width: 640px)');

  const { range, active, previous, next, setPage } = usePagination({
    total: total,
    initialPage: (paginationParams as any).pageIndex + 1,
    boundaries: 1,
    siblings: 1,
    onChange: (page) => {
      setPaginationParams({
        ...paginationParams,
        pageIndex: page - 1,
      });
    },
  });

  // Sync internal state with external prop changes
  const externalPage = (paginationParams as any).pageIndex + 1;
  if (externalPage !== active) {
    setPage(externalPage);
  }

  const handleSizeChange = (newSize: number) => {
    setPaginationParams({
      ...paginationParams,
      pageSize: newSize,
      pageIndex: 0,
    });
  };

  if (isMobile) {
    return (
      <div className="flex w-full items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 gap-2 rounded-full bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
              >
                {currentSize}
                <ChevronDownIcon className="size-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-16 rounded-xl shadow-xl border-border/50 backdrop-blur-lg"
            >
              {totalItemsPerPageOptions.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={
                    size === currentSize
                      ? 'bg-primary/10 text-primary font-bold'
                      : ''
                  }
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {listTotal !== undefined && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/40 hidden xs:inline">
              Total {listTotal}
            </span>
          )}
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            const velocityThreshold = 500;
            if (
              info.offset.x > swipeThreshold ||
              info.velocity.x > velocityThreshold
            ) {
              if (active > 1) previous();
            } else if (
              info.offset.x < -swipeThreshold ||
              info.velocity.x < -velocityThreshold
            ) {
              if (active < total) next();
            }
          }}
          className="flex items-center gap-1 bg-accent/30 rounded-full p-1 border border-border/50 backdrop-blur-sm shadow-inner overflow-hidden touch-none"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            disabled={active === 1}
            className="size-8 rounded-full hover:bg-background/80 disabled:opacity-30 active:scale-90 transition-all text-foreground"
          >
            <Icon icon="ph:caret-left-bold" className="size-4" />
          </Button>

          <div className="px-3 flex items-center gap-1.5 min-w-[90px] justify-center relative select-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="text-sm font-bold tabular-nums"
              >
                {active}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] font-black text-muted-foreground/30 select-none">
              /
            </span>
            <span className="text-sm font-bold tabular-nums text-muted-foreground/60">
              {total}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={active === total}
            className="size-8 rounded-full hover:bg-background/80 disabled:opacity-30 active:scale-90 transition-all text-foreground"
          >
            <Icon icon="ph:caret-right-bold" className="size-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
        <span className="shrink-0 hidden sm:inline">Itens por página</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 focus-visible:ring-0 text-xs"
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
          <div className="text-sm text-muted-foreground ml-2 border-l pl-4 border-border">
            Total de itens: {listTotal}
          </div>
        )}
      </div>

      <Pagination className="mx-0 w-auto flex justify-end text-foreground">
        <PaginationContent className="gap-1">
          {active > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={previous}
                className="cursor-pointer h-10 px-4 text-sm"
              />
            </PaginationItem>
          )}
          {range.map((page, idx) => {
            if (page === 'dots') {
              return (
                <PaginationItem
                  key={`dots-${range[idx - 1]}-${range[idx + 1]}`}
                >
                  <PaginationEllipsis className="h-10 w-10 text-muted-foreground/50" />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer h-10 w-10 text-sm font-medium transition-all active:scale-90"
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
                className="cursor-pointer h-10 px-4 text-sm font-medium transition-all active:scale-90"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
