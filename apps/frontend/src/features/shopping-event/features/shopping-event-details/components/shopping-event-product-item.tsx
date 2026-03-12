'use client';

import { Icon } from '@iconify/react';
import { useMediaQuery } from '@mantine/hooks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useEffect, useRef } from 'react';
import { RemoveProductFromCartDrawer, UpdateProductInCartDrawer } from './cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fCurrency } from '@/domain';
import type { ShoppingEventStatus } from '@/features/shopping-event/domain';
import { useHaptics } from '@/hooks/use-haptics';
import type { GetShoppingEventById200ProductsItem } from '@/infrastructure/api/types';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  product: GetShoppingEventById200ProductsItem;
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

  const isOngoing = shoppingEventStatus === 'ongoing';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const haptics = useHaptics();
  const x = useMotionValue(0);
  const controls = useAnimation();
  const hasHapticTriggered = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  // Track swipe thresholds for haptics
  useEffect(() => {
    return x.on('change', (latest) => {
      if (!isMobile) return;

      // Threshold for "locking" the action
      const threshold = 60;

      // Swipe Left (reveals right) -> Edit
      if (latest < -threshold && !hasHapticTriggered.current.left) {
        haptics.light();
        hasHapticTriggered.current.left = true;
      } else if (latest > -threshold) {
        hasHapticTriggered.current.left = false;
      }

      // Swipe Right (reveals left) -> Delete
      if (latest > threshold && !hasHapticTriggered.current.right) {
        haptics.light();
        hasHapticTriggered.current.right = true;
      } else if (latest < threshold) {
        hasHapticTriggered.current.right = false;
      }
    });
  }, [x, haptics, isMobile]);

  // Peek animation for discoverability
  useEffect(() => {
    if (isMobile && isOngoing) {
      const timer = setTimeout(() => {
        // Subtle peek to both sides
        controls
          .start({ x: -15, transition: { duration: 0.2 } })
          .then(() => controls.start({ x: 15, transition: { duration: 0.2 } }))
          .then(() => controls.start({ x: 0, transition: { duration: 0.2 } }));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [controls, isMobile, isOngoing]);

  // Visual feedback transforms
  const editOpacity = useTransform(x, [-100, -20], [1, 0]);
  const editScale = useTransform(x, [-100, -20], [1, 0.8]);
  const deleteOpacity = useTransform(x, [20, 100], [0, 1]);
  const deleteScale = useTransform(x, [20, 100], [0.8, 1]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      controls.start({ x: -100 });
    } else if (info.offset.x > threshold) {
      controls.start({ x: 100 });
    } else {
      controls.start({ x: 0 });
    }
  };

  const cardContent = (
    <div className="flex items-start gap-3 px-2 py-1 bg-card">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
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
              {fCurrency(product.totalDifference ?? 0)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0 text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-[11px]">
            <Icon icon="mingcute:time-line" className="size-3" />
            {format(product.addedAt, 'HH:mm:ss', { locale: ptBR })}
          </span>
          <span className="text-border text-sm">/</span>
          <StatValue label="Qtd:" value={(product.amount ?? 0).toString()} />
          <span className="text-border text-sm">/</span>
          <StatValue label="Preço:" value={fCurrency(product.price ?? 0)} />
          <span className="text-border text-sm">/</span>
          <StatValue
            label="Total:"
            value={fCurrency(product.totalRetailPrice)}
            highlight
          />

          {hasWholesale && (
            <>
              <span className="text-border text-sm">/</span>
              <StatValue
                label="Mín. Atac:"
                value={(product.wholesaleMinAmount ?? 0).toString()}
              />
              <span className="text-border text-sm">/</span>
              <StatValue
                label="Atac.:"
                value={fCurrency(product.wholesalePrice ?? 0)}
              />
              {product.totalWholesalePrice != null && (
                <>
                  <span className="text-border text-sm">/</span>
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

      {!isMobile && isOngoing && (
        <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <UpdateProductInCartDrawer
                  shoppingEventId={shoppingEventId}
                  product={product}
                >
                  <Button size="icon" variant="ghost" className="size-7">
                    <Icon icon="mingcute:edit-2-line" className="size-3.5" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </UpdateProductInCartDrawer>
              </TooltipTrigger>
              <TooltipContent side="bottom">Editar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <RemoveProductFromCartDrawer
                  shoppingEventId={shoppingEventId}
                  product={product}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Icon icon="mingcute:delete-2-line" className="size-3.5" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </RemoveProductFromCartDrawer>
              </TooltipTrigger>
              <TooltipContent side="bottom">Remover</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );

  return (
    <Card className="relative overflow-hidden transition-colors hover:bg-muted/40 p-0">
      {isMobile && isOngoing && (
        <>
          {/* Action on Swipe Left -> Edit (revealed on right) */}
          <motion.div
            style={{ opacity: editOpacity, scale: editScale }}
            className="absolute inset-y-0 right-0 flex items-center gap-1 pr-4 bg-primary/10 w-full justify-end"
          >
            <UpdateProductInCartDrawer
              shoppingEventId={shoppingEventId}
              product={product}
            >
              <Button
                size="icon-xl"
                variant="default"
                className="rounded-full shadow-lg"
              >
                <Icon icon="mingcute:edit-2-line" className="size-5" />
              </Button>
            </UpdateProductInCartDrawer>
          </motion.div>

          {/* Action on Swipe Right -> Delete (revealed on left) */}
          <motion.div
            style={{ opacity: deleteOpacity, scale: deleteScale }}
            className="absolute inset-y-0 left-0 flex items-center gap-1 pl-4 bg-destructive/10 w-full justify-start"
          >
            <RemoveProductFromCartDrawer
              shoppingEventId={shoppingEventId}
              product={product}
            >
              <Button
                size="icon-xl"
                variant="destructive"
                className="rounded-full shadow-lg"
              >
                <Icon icon="mingcute:delete-2-line" className="size-5" />
              </Button>
            </RemoveProductFromCartDrawer>
          </motion.div>
        </>
      )}

      {isMobile && isOngoing ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: -100, right: 100 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ x }}
          className="relative z-10 p-2 bg-card cursor-grab active:cursor-grabbing touch-none"
        >
          {cardContent}
        </motion.div>
      ) : (
        <div className="p-2">{cardContent}</div>
      )}
    </Card>
  );
}
