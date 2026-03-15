import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ShoppingEventStatus } from '@/features/shopping-event/domain';
import type { GetShoppingEventById200 } from '@/infrastructure/api/types';

interface ShoppingEventDetailsHeaderProps {
  shoppingEvent: GetShoppingEventById200;
}

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${weekday} - ${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getStatusLabel(status: ShoppingEventStatus): string {
  const map: Record<ShoppingEventStatus, string> = {
    ongoing: 'Em andamento',
    finished: 'Finalizada',
    canceled: 'Cancelada',
  };
  return map[status] ?? status;
}

/** Maps a status to a badge variant style */
export type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function getStatusVariant(status: ShoppingEventStatus): StatusVariant {
  const map: Record<ShoppingEventStatus, StatusVariant> = {
    ongoing: 'default',
    finished: 'secondary',
    canceled: 'destructive',
  };
  return map[status] ?? 'outline';
}

export function ShoppingEventDetailsHeader({
  shoppingEvent,
}: ShoppingEventDetailsHeaderProps) {
  const status = getStatusLabel(shoppingEvent.status);
  const variant = getStatusVariant(shoppingEvent.status);

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left - Market + date */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex flex-col gap-1">
          <p className="text-sm font-semibold leading-tight truncate">
            {shoppingEvent.market?.name ?? 'Mercado desconhecido'}
          </p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="text-xs truncate">
              {formatDate(shoppingEvent.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Right - Status badge */}
      <Badge variant={variant} className="shrink-0 text-xs">
        {status}
      </Badge>
    </div>
  );
}
