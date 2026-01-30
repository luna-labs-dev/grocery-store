import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components';
import HourglassIcon from '@/components/hourglass-icon';
import { InputGroupAddon } from '@/components/ui/input-group';
import type { MarketListItem } from '@/features/market';
import { useGetMarketListQuery } from '@/features/market/infrastructure';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';

export const StartShoppingEvent = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useStartShoppingEventMutation();

  const [value, setValue] = useState<MarketListItem | null>(null);

  const { data, isLoading } = useGetMarketListQuery({
    pageIndex: 0,
    pageSize: 50,
    orderBy: 'createdAt',
    orderDirection: 'asc',
  });

  const marketList: MarketListItem[] = data?.items ?? [];
  const loadingIcon = (
    <HourglassIcon
      className="text-black dark:text-white"
      size={40}
      duration={0.5}
      strokeWidth={2}
      repeatDelay={1}
      ease="easeInOut"
    />
  );
  const marketIcon = <Icon icon={'lsicon:marketplace-outline'} />;
  return (
    <Card>
      <CardContent>
        <Combobox
          items={marketList}
          value={value}
          itemToStringLabel={(item: MarketListItem) => item.name}
          itemToStringValue={(item: MarketListItem) => item.code}
          isItemEqualToValue={(itemValue, selectedValue) =>
            itemValue.code === selectedValue.code
          }
          onValueChange={(item) => {
            setValue(item);
          }}
        >
          <ComboboxInput placeholder="Selecione um mercado" showClear={true}>
            <InputGroupAddon>
              {isLoading ? loadingIcon : marketIcon}
            </InputGroupAddon>
          </ComboboxInput>
          <ComboboxContent>
            <ComboboxEmpty>Nenhum mercado selecionado</ComboboxEmpty>
            <ComboboxList>
              {(market: MarketListItem) => (
                <ComboboxItem key={market.id} value={market}>
                  {market.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </CardContent>

      <CardFooter className="justify-start gap-4">
        <Button
          variant="outline"
          onClick={() =>
            navigate({
              to: '..',
            })
          }
        >
          Cancelar
        </Button>
        <Button
          disabled={!value}
          onClick={async () => {
            if (value) {
              const shoppingEvent = await mutateAsync({ marketId: value.id });
              navigate({
                to: `/app/shopping-event/$shoppingEventId`,
                params: { shoppingEventId: shoppingEvent.id },
                replace: true,
              });
              return;
            }
          }}
        >
          Iniciar
        </Button>
      </CardFooter>
    </Card>
  );
};
