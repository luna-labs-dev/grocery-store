import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components';
import HourglassIcon from '@/components/hourglass-icon';
import type { MarketListItem } from '@/features/market';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';

export interface MarketItemParams {
  market: MarketListItem;
}

export const MarketItem = ({ market }: MarketItemParams) => {
  const { mutateAsync, isPending } = useStartShoppingEventMutation();
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{market.name}</CardTitle>
        <CardDescription>{market.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>Criado em</ItemTitle>
              <ItemDescription className="text-xs">
                {format(market.createdAt, 'dd/MMyyyy HH:mm:ss')}
              </ItemDescription>
            </ItemContent>
          </Item>
          <div className="flex justify-end gap-2">
            <Button
              size={'sm'}
              variant="secondary"
              className="w-28"
              disabled={isPending}
              onClick={async () => {
                const shoppingEvent = await mutateAsync({
                  marketId: market.id,
                });
                navigate({
                  to: '/shopping-event/$shoppingEventId',
                  params: {
                    shoppingEventId: shoppingEvent.id,
                  },
                  replace: true,
                });
              }}
            >
              {isPending && <HourglassIcon size={18} />}
              Comprar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
