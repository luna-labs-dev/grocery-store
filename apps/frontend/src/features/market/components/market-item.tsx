import { useNavigate } from '@tanstack/react-router';
import { MapPin, ShoppingBasket } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components';
import HourglassIcon from '@/components/hourglass-icon';
import type { MarketListItem } from '@/features/market';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';

export interface MarketItemParams {
  market: MarketListItem;
}

const getDistanceVariant = (distance: number) => {
  if (distance <= 1000) {
    return 'success';
  }
  if (distance <= 5000) {
    return 'info';
  }

  return 'warning';
};

export const MarketItem = ({ market }: MarketItemParams) => {
  const { mutateAsync, isPending } = useStartShoppingEventMutation();
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col h-full p-3 sm:p-4 rounded-lg gap-2 sm:gap-3">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base sm:text-lg leading-tight">
              {market.name}
            </CardTitle>
            <span className="text-[11px] sm:text-xs text-muted-foreground">
              {[market.neighborhood, market.city].filter(Boolean).join(' - ')}
            </span>
          </div>
          {market.distance !== undefined && (
            <Badge
              variant={getDistanceVariant(market.distance)}
              className="whitespace-nowrap shrink-0 px-2 py-0 text-[10px] sm:text-xs"
            >
              {(market.distance / 1000).toFixed(1)} km
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 justify-center">
        <div className="flex items-start gap-1.5 mt-1 sm:mt-2">
          <MapPin className="size-3.5 sm:size-4 mt-0.5 shrink-0 text-muted-foreground" />
          <span className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2">
            {market.formattedAddress}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-0 mt-2 sm:mt-auto">
        <div className="flex w-full justify-end">
          <Button
            size="sm"
            className="sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
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
              <HourglassIcon
                size={14}
                className="mr-2 animate-spin sm:size-4"
              />
            ) : (
              <ShoppingBasket size={14} className="mr-2 sm:size-4" />
            )}
            Iniciar Compra
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
