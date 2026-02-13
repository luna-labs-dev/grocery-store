import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type React from 'react';
import { RemoveProductFromCartDialog, UpdateProductInCartSheet } from './cart';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { fCurrency } from '@/domain';
import type {
  Product,
  ShoppingEventStatus,
} from '@/features/shopping-event/domain';
import { cn } from '@/lib/utils';

interface StatProps {
  label: string;
  value: string;
  className?: string;
}

function Stat({ label, value, className }: StatProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

interface ProductItemProps {
  product: Product;
  shoppingEventId: string;
  shoppingEventStatus: ShoppingEventStatus;
  editTrigger?: React.ReactNode;
  removeTrigger?: React.ReactNode;
}

export function ProductItem({
  product,
  shoppingEventStatus,
  shoppingEventId,
  editTrigger,
  removeTrigger,
}: ProductItemProps) {
  const hasWholesale = product.wholesalePrice && product.wholesaleMinAmount;

  return (
    <Card className="transition-colors hover:bg-muted/30 p-2">
      <CardContent className="flex flex-col gap-2 px-2 py-1 md:flex-row md:items-center md:gap-3">
        {/* Top row: Product name + time + actions (mobile) */}
        <div className="flex min-w-0 items-start justify-between gap-2 md:flex-1">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {product.name}
              </span>
              {product.totalDifference && product.wholesalePrice && (
                <Badge
                  variant="secondary"
                  className="shrink-0 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[10px] text-emerald-700"
                >
                  <Icon
                    icon="mingcute:arrow-down-line"
                    className="mr-0.5 size-3"
                  />
                  {fCurrency(product.totalDifference)}
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              <Icon
                icon="mingcute:time-line"
                className="mr-0.5 inline size-3 align-[-2px]"
              />
              {format(product.addedAt, 'HH:mm:ss', { locale: ptBR })}
            </span>
          </div>

          {/* Actions on mobile - top right */}
          {shoppingEventStatus === 'ONGOING' && (
            <div className="flex shrink-0 items-center gap-2 md:hidden">
              <TooltipProvider delayDuration={200}>
                {editTrigger ?? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <UpdateProductInCartSheet
                        shoppingEventId={shoppingEventId}
                        product={product}
                      >
                        <Button size="icon" variant="ghost" className="size-7">
                          <Icon
                            icon="mingcute:edit-2-line"
                            className="size-3.5"
                          />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </UpdateProductInCartSheet>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Editar</TooltipContent>
                  </Tooltip>
                )}
                {removeTrigger ?? (
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
                )}
              </TooltipProvider>
            </div>
          )}
        </div>

        <Separator className="md:hidden" />
        <Separator orientation="vertical" className="hidden h-8 md:visible" />

        {/* Stats - wrapping grid on mobile, inline on desktop */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 md:flex md:shrink-0 md:items-center md:gap-3">
          <Stat label="Qtd" value={product.amount.toString()} />
          <Stat label="Preço" value={fCurrency(product.price ?? 0)} />
          <Stat
            label="Total"
            value={fCurrency(product.totalRetailPrice)}
            className="font-semibold"
          />

          {hasWholesale && (
            <>
              <Stat
                label="Mín. Atac."
                value={(product.wholesaleMinAmount ?? 0).toString()}
              />
              <Stat
                label="Preço Atac."
                value={fCurrency(product.wholesalePrice ?? 0)}
              />
              {product.totalWholesalePrice != null && (
                <Stat
                  label="Total Atac."
                  value={fCurrency(product.totalWholesalePrice)}
                />
              )}
            </>
          )}
        </div>

        {/* Actions on desktop - far right */}
        {shoppingEventStatus === 'ONGOING' && (
          <>
            <Separator orientation="vertical" className="hidden h-8 md:block" />
            <div className="hidden shrink-0 items-center gap-1 md:flex">
              <TooltipProvider delayDuration={200}>
                {editTrigger ?? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <UpdateProductInCartSheet
                        shoppingEventId={shoppingEventId}
                        product={product}
                      >
                        <Button size="icon" variant="ghost" className="size-7">
                          <Icon
                            icon="mingcute:edit-2-line"
                            className="size-3.5"
                          />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </UpdateProductInCartSheet>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Editar</TooltipContent>
                  </Tooltip>
                )}
                {removeTrigger ?? (
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
                )}
              </TooltipProvider>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
