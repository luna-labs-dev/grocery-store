import { Link, useNavigate } from '@tanstack/react-router';
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
            <Link
              to={'/market/update/$marketId'}
              params={{
                marketId: market.id,
              }}
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
                  to: '/shopping-event/$shoppingEventId',
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
