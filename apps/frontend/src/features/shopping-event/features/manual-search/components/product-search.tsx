import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { ScanResult } from '../../product-scan/hooks/use-scan-product';
import { Loading } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { httpClient } from '@/config/clients/http-client';
import { useIsInView } from '@/hooks/use-is-in-view';

interface ProductSearchProps {
  onSelect: (product: ScanResult['product']) => void;
  onCancel: () => void;
}

export const ProductSearch = ({ onSelect, onCancel }: ProductSearchProps) => {
  const [query, setQuery] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['product-search', query],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await httpClient.get('/products/search', {
        params: {
          query,
          pageIndex: pageParam,
          pageSize: 10,
        },
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPageIndex = allPages.length;
      return lastPage.items.length === 10 ? nextPageIndex : undefined;
    },
    enabled: query.length >= 2,
  });

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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
              onClick={() => onSelect(product)}
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

          {!isLoading && allProducts.length === 0 && query.length >= 2 && (
            <p className="text-center text-muted-foreground py-8">
              No products found
            </p>
          )}
          {query.length < 2 && (
            <p className="text-center text-muted-foreground py-8 italic font-light opacity-60">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
