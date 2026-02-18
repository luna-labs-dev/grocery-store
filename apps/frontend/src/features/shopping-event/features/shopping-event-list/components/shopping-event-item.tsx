'use client';

import { useNavigate } from '@tanstack/react-router';
import type { VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarDays,
  ChevronRight,
  Package,
  PercentCircle,
  ShoppingCart,
  Store,
  Truck,
} from 'lucide-react';
import { Badge, type badgeVariants } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ShoppingEventListItem } from '@/features/shopping-event/domain';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> =
  {
    CANCELLED: { label: 'Cancelado', variant: 'error' },
    ONGOING: { label: 'Em andamento', variant: 'info' },
    FINISHED: { label: 'Concluido', variant: 'success' },
  };

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status] ?? {
      label: status,
      variant: 'outline' as BadgeVariant,
    }
  );
}

function fCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function fPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCell({ icon, label, value }: StatCellProps) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] leading-none text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-xs font-semibold tabular-nums leading-tight">
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ShoppingEventItemProps {
  shoppingEvent: ShoppingEventListItem;
}

export function ShoppingEventItem({ shoppingEvent }: ShoppingEventItemProps) {
  const navigate = useNavigate();
  const createdAt = new Date(shoppingEvent.createdAt);
  const { label, variant } = getStatusConfig(shoppingEvent.status);

  return (
    <Card
      onClick={() => {
        navigate({
          to: '/shopping-event/$shoppingEventId',
          params: { shoppingEventId: shoppingEvent.id },
          replace: true,
        });
      }}
      className="cursor-pointer gap-2 py-3 transition-colors hover:bg-accent/40"
    >
      {/* Row 1: Store name + status badge */}
      <CardHeader className="gap-0.5 px-3 py-0">
        <div className="flex items-center gap-2 min-w-0">
          <Store className="size-3.5 text-muted-foreground shrink-0" />
          <CardTitle className="text-sm truncate">
            {shoppingEvent.market}
          </CardTitle>
        </div>
        <CardAction>
          <div className="flex items-center gap-1.5">
            <Badge variant={variant} className="text-[10px] px-1.5 py-0">
              {label}
            </Badge>
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </div>
        </CardAction>
      </CardHeader>

      <Separator />

      {/* Row 2: All totals in a compact grid */}
      <CardContent className="px-3 py-0">
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">
          <StatCell
            icon={<ShoppingCart className="size-2.5" />}
            label="Varejo"
            value={fCurrency(shoppingEvent.totals.retailTotal)}
          />
          <StatCell
            icon={<Truck className="size-2.5" />}
            label="Atacado"
            value={fCurrency(shoppingEvent.totals.wholesaleTotal)}
          />
          <StatCell
            icon={<PercentCircle className="size-2.5" />}
            label="Economia"
            value={fPercentage(shoppingEvent.totals.savingsPercentage)}
          />
          <StatCell
            icon={<Package className="size-2.5" />}
            label="Itens"
            value={`${shoppingEvent.totals.totalItemsDistinct} prod.`}
          />
          <StatCell
            icon={<ShoppingCart className="size-2.5" />}
            label="Quantidade"
            value={`${shoppingEvent.totals.totalItemsQuantity} un.`}
          />
          <div className="flex flex-col gap-0.5 min-w-0 justify-end">
            <span className="text-[10px] leading-none text-muted-foreground flex items-center gap-1">
              <CalendarDays className="size-2.5" />
              Data
            </span>
            <span className="text-xs tabular-nums leading-tight text-muted-foreground">
              {format(createdAt, 'dd/MM/yy HH:mm', { locale: ptBR })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
