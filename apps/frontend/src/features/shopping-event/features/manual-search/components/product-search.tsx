import type { InfiniteData } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Loading } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsInView } from '@/hooks/use-is-in-view';
import { useSearchProductInfinite } from '@/infrastructure/api/cart';
import type {
  ScanProduct200,
  SearchProduct200,
} from '@/infrastructure/api/types';

interface ProductSearchProps {
  onSelect: (product: ScanProduct200['product']) => void;
  onCancel: () => void;
}

export const ProductSearch = ({ onSelect, onCancel }: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSearchProductInfinite<InfiniteData<SearchProduct200>>(
    { searchQuery },
    {
      query: {
        queryKey: ['search-product', searchQuery],
        enabled: searchQuery.length >= 2,
        initialPageParam: 0,
        getNextPageParam: (lastPage: SearchProduct200) =>
          lastPage.nextPageIndex ?? undefined,
      },
    },
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { isInView } = useIsInView(loadMoreRef);

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-2">
        <Input
          placeholder="Search products by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          autoFocus
        />
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <Loading text="Searching products..." />}
        {isError && <p className="text-destructive">Error loading results</p>}

        <div className="flex flex-col gap-2">
          {allProducts.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => onSelect(product as ScanProduct200['product'])}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted transition-colors text-left w-full"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">
                    {product.brand}
                  </p>
                )}
              </div>
            </button>
          ))}

          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center"
          >
            {isFetchingNextPage && <Loading text="Loading more..." />}
          </div>

          {!isLoading &&
            allProducts.length === 0 &&
            searchQuery.length >= 2 && (
              <p className="text-center text-muted-foreground py-8">
                No products found
              </p>
            )}
          {searchQuery.length < 2 && (
            <p className="text-center text-muted-foreground py-8 italic font-light opacity-60">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
