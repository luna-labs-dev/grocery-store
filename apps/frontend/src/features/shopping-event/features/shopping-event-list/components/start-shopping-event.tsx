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
import { useGetMarketListQuery } from '@/features/market/infrastructure';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';
import type { ListMarkets200ItemsItem } from '@/infrastructure/api/types';

export const StartShoppingEvent = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useStartShoppingEventMutation();

  const [value, setValue] = useState<ListMarkets200ItemsItem | null>(null);

  const { data, isLoading } = useGetMarketListQuery();

  const marketList: ListMarkets200ItemsItem[] = data?.items ?? [];
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
            itemToStringLabel={(item: ListMarkets200ItemsItem) => item.name}
            itemToStringValue={(item: ListMarkets200ItemsItem) => item.id}
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
                {(market: ListMarkets200ItemsItem) => (
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
              size="sm"
              className="w-28 h-9 font-bold"
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
              size="sm"
              className="w-28 h-9 font-bold"
              onClick={async () => {
                if (value) {
                  const shoppingEvent = await mutateAsync({
                    data: {
                      marketId: value.id,
                    },
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
