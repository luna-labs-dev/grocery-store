import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  getStatus,
  type ShoppingEvent,
} from '@/features/shopping-event/domain';

interface ShoppingEventDetailsHeaderProps {
  shoppingEvent: ShoppingEvent;
}

export const ShoppingEventDetailsHeader = ({
  shoppingEvent,
}: ShoppingEventDetailsHeaderProps) => {
  return (
    <section className="flex justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:gap-6">
        <div className="flex items-center gap-1">
          <Icon icon="mingcute:shop-line" />
          <p className="text-sm">{shoppingEvent.market.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="mingcute:calendar-2-line" />
          <p className="text-sm">
            {format(shoppingEvent.createdAt, 'EEEEEE - dd/MM/yyyy HH:mm:ss ', {
              locale: ptBR,
            })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="mingcute:tag-line" />
          <p className="text-sm">{getStatus(shoppingEvent.status)}</p>
        </div>
      </div>
      <div></div>
    </section>
  );
};
