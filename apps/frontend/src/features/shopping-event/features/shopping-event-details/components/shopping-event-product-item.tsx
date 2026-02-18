'use client';

import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RemoveProductFromCartDialog, UpdateProductInCartSheet } from './cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fCurrency } from '@/domain';
import type {
  Product,
  ShoppingEventStatus,
} from '@/features/shopping-event/domain';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  product: Product;
  shoppingEventId: string;
  shoppingEventStatus: ShoppingEventStatus;
}

function StatValue({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <span className={cn('text-foreground', highlight && 'font-semibold')}>
        {value}
      </span>
    </span>
  );
}

export function ProductItem({
  product,
  shoppingEventId,
  shoppingEventStatus,
}: ProductItemProps) {
  const hasWholesale = product.wholesalePrice && product.wholesaleMinAmount;
  const hasSavings = !!product.totalDifference && product.totalDifference > 0;

  const isOngoing = shoppingEventStatus === 'ONGOING';

  return (
    <Card className="transition-colors hover:bg-muted/40 p-2">
      <CardContent className="flex items-start gap-3 px-2 py-1">
        {/* Left content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Product name */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium leading-tight text-foreground">
              {product.name}
            </span>
            {hasSavings && (
              <Badge
                variant="secondary"
                className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
              >
                <Icon
                  icon="mingcute:arrow-down-line"
                  className="mr-0.5 size-2.5"
                />
                {/** biome-ignore lint/style/noNonNullAssertion: this field is definately not null since it was already checked in the hasSavings condition */}
                {fCurrency(product.totalDifference!)}
              </Badge>
            )}
          </div>

          {/* Inline stats row - wraps naturally */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Icon icon="mingcute:time-line" className="size-3" />
              {format(product.addedAt, 'HH:mm:ss', { locale: ptBR })}
            </span>

            <span className="text-border text-sm">{'/'}</span>

            <StatValue label="Qtd:" value={product.amount.toString()} />

            <span className="text-border text-sm">{'/'}</span>

            <StatValue label="Preço:" value={fCurrency(product.price ?? 0)} />

            <span className="text-border text-sm">{'/'}</span>

            <StatValue
              label="Total:"
              value={fCurrency(product.totalRetailPrice)}
              highlight
            />

            {hasWholesale && (
              <>
                <span className="text-border text-sm">{'/'}</span>
                <StatValue
                  label="Mín. Atac:"
                  value={(product.wholesaleMinAmount ?? 0).toString()}
                />
                <span className="text-border text-sm">{'/'}</span>
                <StatValue
                  label="Atac.:"
                  value={fCurrency(product.wholesalePrice ?? 0)}
                />
                {product.totalWholesalePrice != null && (
                  <>
                    <span className="text-border text-sm">{'/'}</span>
                    <StatValue
                      label="T. Atac.:"
                      value={fCurrency(product.totalWholesalePrice)}
                      highlight
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {isOngoing && (
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <UpdateProductInCartSheet
                    shoppingEventId={shoppingEventId}
                    product={product}
                  >
                    <Button size="icon" variant="ghost" className="size-7">
                      <Icon icon="mingcute:edit-2-line" className="size-3.5" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </UpdateProductInCartSheet>
                </TooltipTrigger>
                <TooltipContent side="bottom">Editar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <RemoveProductFromCartDialog
                    shoppingEventId={shoppingEventId}
                    product={product}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icon
                        icon="mingcute:delete-2-line"
                        className="size-3.5"
                      />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </RemoveProductFromCartDialog>
                </TooltipTrigger>
                <TooltipContent side="bottom">Remover</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
