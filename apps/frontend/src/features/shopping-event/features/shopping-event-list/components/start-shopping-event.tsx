import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Button,
  ButtonGroup,
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
  const { mutateAsync, isPending } = useStartShoppingEventMutation();

  const [value, setValue] = useState<MarketListItem | null>(null);

  const { data, isLoading } = useGetMarketListQuery();

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
    <div className="p-4">
      <Card className="">
        <CardContent>
          <Combobox
            items={marketList}
            value={value}
            itemToStringLabel={(item: MarketListItem) => item.name}
            itemToStringValue={(item: MarketListItem) => item.id}
            isItemEqualToValue={(itemValue, selectedValue) =>
              itemValue.id === selectedValue.id
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

        <CardFooter className="justify-end gap-4">
          <ButtonGroup>
            <Button
              variant="outline"
              className="w-28"
              onClick={() =>
                navigate({
                  to: '..',
                })
              }
            >
              Cancelar
            </Button>
            <Button
              disabled={!value || isPending}
              className="w-28"
              onClick={async () => {
                if (value) {
                  const shoppingEvent = await mutateAsync({
                    marketId: value.id,
                  });
                  navigate({
                    to: '/shopping-event/$shoppingEventId',
                    params: { shoppingEventId: shoppingEvent.id },
                    replace: true,
                  });
                  return;
                }
              }}
            >
              {isPending && <HourglassIcon />}
              Iniciar
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
};
