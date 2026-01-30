import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components';
import { fCurrency } from '@/domain';
import {
  getStatus,
  type ShoppingEventListItem,
} from '@/features/shopping-event/domain';

interface ShoppingEventListItemProps {
  shoppingEvent: ShoppingEventListItem;
}
export const ShoppingEventItem = ({
  shoppingEvent,
}: ShoppingEventListItemProps) => {
  const navigate = useNavigate();
  shoppingEvent.createdAt = new Date(shoppingEvent.createdAt);

  return (
    <Card
      onClick={() => {
        navigate({
          to: '/app/shopping-event/$shoppingEventId',
          params: { shoppingEventId: shoppingEvent.id },
          replace: true,
        });
      }}
      className="cursor-pointer"
    >
      <CardHeader className="flex flex-col ">
        <CardTitle className="flex flex-col items-start">
          {shoppingEvent.market}
        </CardTitle>
        <CardDescription className="text-sm">
          {getStatus(shoppingEvent.status)}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex gap-6">
          <div className="grid grid-cols-[20px_1fr] items-start">
            <Icon icon={'prime:circle'} className="translate-y-2" />

            <div className="space-y-1">
              <span className="text-xs font-medium leading-none text-muted-foreground">
                total varejo
              </span>
              <p className="text-sm">
                {fCurrency(shoppingEvent.totals.retailTotal)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start">
            <Icon icon={'f7:rectangle-grid-2x2'} className="translate-y-2" />

            <div className="space-y-1">
              <span className="text-xs font-medium leading-none text-muted-foreground">
                total atacado
              </span>
              <p className="text-sm">
                {fCurrency(shoppingEvent.totals.wholesaleTotal)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-end justify-end w-full">
          <div className="flex flex-col items-end">
            <p className="text-[8pt] font-bold text-muted-foreground">
              {format(shoppingEvent.createdAt, 'HH:mm:ss', { locale: ptBR })}
            </p>
            <p className="text-xs font-bold text-muted-foreground">
              {format(shoppingEvent.createdAt, 'dd MM yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
