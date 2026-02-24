import { useNavigate } from '@tanstack/react-router';
import { MapPin, ShoppingBasket } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <CardTitle className="flex items-baseline gap-2 flex-wrap">
              <span>{market.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {[market.neighborhood, market.city].filter(Boolean).join(' - ')}
              </span>
            </CardTitle>
            <CardDescription className="flex items-start gap-1 text-xs">
              <MapPin className="size-3.5 mt-0.5 shrink-0" />
              <span>{market.formattedAddress}</span>
            </CardDescription>
          </div>
          {market.distance !== undefined && (
            <Badge
              variant={
                market.distance <= 1000
                  ? 'success'
                  : market.distance <= 3000
                    ? 'info'
                    : 'warning'
              }
              className="whitespace-nowrap"
            >
              {(market.distance / 1000).toFixed(1)} km
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex w-full justify-end mt-auto pt-4">
          <Button
            size="sm"
            className="w-auto"
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
            {isPending ? (
              <HourglassIcon size={16} className="mr-2 animate-spin" />
            ) : (
              <ShoppingBasket size={16} className="mr-2" />
            )}
            Iniciar Compra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
