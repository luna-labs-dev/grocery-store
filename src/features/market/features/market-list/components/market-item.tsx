import { Link, useNavigate } from '@tanstack/react-router';
import { UpdateMarketDialog } from '../../update-market/update-market-dialog';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components';
import type { MarketListItem } from '@/features/market';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';

export interface MarketItemParams {
  market: MarketListItem;
}

export const MarketItem = ({ market }: MarketItemParams) => {
  const { mutateAsync } = useStartShoppingEventMutation();
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{market.name}</CardTitle>
        <CardDescription>{market.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2">
          <div>
            <UpdateMarketDialog
              options={{
                triggerName: 'Editar',
                marketId: market.id,
              }}
            />
            <Link
              to={`/app/market/update/$marketId`}
              params={{
                marketId: market.id,
              }}
              className="block md:hidden"
            >
              <Button size={'sm'}>Editar</Button>
            </Link>
          </div>
          <div>
            <Button
              size={'sm'}
              variant="secondary"
              onClick={async () => {
                const shoppingEvent = await mutateAsync({
                  marketId: market.id,
                });
                navigate({
                  to: '/app/shopping-event/$shoppingEventId',
                  params: {
                    shoppingEventId: shoppingEvent.id,
                  },
                  replace: true,
                });
              }}
            >
              Iniciar compra
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
