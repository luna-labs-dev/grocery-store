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
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
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
          to: '/shopping-event/$shoppingEventId',
          params: { shoppingEventId: shoppingEvent.id },
          replace: true,
        });
      }}
      className="cursor-pointer p-4"
    >
      <CardHeader className="flex flex-col p-0">
        <CardTitle className="flex flex-col items-start">
          {shoppingEvent.market}
        </CardTitle>
        <CardDescription className="text-sm">
          {getStatus(shoppingEvent.status)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex gap-4">
          <Item className="p-0 gap-2">
            <ItemMedia>
              <Icon icon="mingcute:shopping-cart-2-line" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Total Varejo</ItemTitle>
              <ItemDescription>
                {fCurrency(shoppingEvent.totals.retailTotal)}
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item className="p-0 gap-2">
            <ItemMedia>
              <Icon icon="mingcute:truck-line" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Total atacado</ItemTitle>
              <ItemDescription>
                {fCurrency(shoppingEvent.totals.wholesaleTotal)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </CardContent>
      <CardFooter className="px-0">
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
