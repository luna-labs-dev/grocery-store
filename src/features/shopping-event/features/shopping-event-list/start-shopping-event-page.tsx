import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useStartShoppingEventMutation } from '../../infrastructure';
import {
  Button,
  ButtonGroup,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from '@/components';
import HourglassIcon from '@/components/hourglass-icon';
import { Page } from '@/components/layout/page-layout';
import { InputGroupAddon } from '@/components/ui/input-group';
import type { MarketListItem } from '@/features/market';
import { useGetMarketListQuery } from '@/features/market/infrastructure';

const startShoppingEventFormSchema = z.object({
  marketId: z.string(),
});

export const StartShoppingEventPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useStartShoppingEventMutation();

  const [value, setValue] = useState<MarketListItem | null>(null);

  const { data, isLoading } = useGetMarketListQuery({
    pageIndex: 0,
    pageSize: 50,
    orderBy: 'createdAt',
    orderDirection: 'asc',
  });

  const form = useForm({
    resolver: zodResolver(startShoppingEventFormSchema),
    defaultValues: {
      marketId: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, control } = form;

  const onSubmint = handleSubmit(async (data) => {
    if (value) {
      const shoppingEvent = await mutateAsync({
        marketId: data.marketId,
      });
      navigate({
        to: '/shopping-event/$shoppingEventId',
        params: { shoppingEventId: shoppingEvent.id },
        replace: true,
      });
      return;
    }
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
    <form onSubmit={onSubmint} className="w-full h-full p-4">
      <Page>
        <Page.Content>
          <Controller
            control={control}
            name="marketId"
            render={({ field, fieldState }) => {
              return (
                <ComboboxGroup aria-invalid={fieldState.invalid}>
                  <ComboboxLabel>Lista de mercados</ComboboxLabel>
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
                      field.onChange(item?.id);
                    }}
                  >
                    <ComboboxInput
                      placeholder="Selecione um mercado"
                      showClear={true}
                    >
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
                </ComboboxGroup>
              );
            }}
          />
        </Page.Content>
        <Page.Footer className="flex justify-end">
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
            <Button disabled={!value || isPending} className="w-28">
              {isPending && <HourglassIcon />}
              Iniciar
            </Button>
          </ButtonGroup>
        </Page.Footer>
      </Page>
    </form>
  );
};
