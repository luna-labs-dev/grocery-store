import { Icon } from '@iconify/react';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState } from 'react';
import { MarketList } from './components/market-list';
import { useGetMarketListQuery } from './infrastructure';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@/components';
import { Page } from '@/components/layout/page-layout';
import { GetPositionPermissinDialog } from '@/components/shared/get-position';
import { CustomPagination } from '@/components/shared/pagination';
import type { ListMarketsParams } from '@/infrastructure/api/types';

export const MarketPage = () => {
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isFetching, isError, setParams, params } =
    useGetMarketListQuery();

  const handleSearchDebounced = useDebouncedCallback((search: string) => {
    setParams((prev) => ({ ...prev, search }));
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    handleSearchDebounced(e.target.value);
  };

  return (
    <>
      <Page>
        <Page.Header className="p-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Collapsible className="w-full">
              <div className="flex justify-between items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant={'outline'} size={'xs'}>
                    <Icon icon={'solar:filter-outline'} />
                    Filtros
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  {isFetching && <Spinner className="size-4" />}
                  {!isExpanded && (
                    <Button
                      className="w-fit"
                      variant={'outline'}
                      size={'xs'}
                      onClick={() => {
                        setParams((prev: ListMarketsParams) => ({
                          ...prev,
                          expand: true,
                        }));
                        setIsExpanded(true);
                      }}
                    >
                      <p>
                        Não achou seu mercado?{' '}
                        <span className="font-semibold text-xs">
                          Expandir busca
                        </span>
                      </p>
                    </Button>
                  )}
                </div>
              </div>
              <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all duration-300 flex flex-col gap-2 mt-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Buscar mercado</FieldLabel>
                    <Input
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Buscar mercado"
                    />
                    <FieldDescription>
                      Digite o nome do mercado que deseja buscar
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Page.Header>
        <Page.Content className="p-4 rounded-lg" scrollable={false}>
          <MarketList
            data={data}
            isLoading={isFetching}
            isError={isError}
            pageSize={params.pageSize}
          />
        </Page.Content>
        <Page.Footer className="p-4 border-t">
          <CustomPagination
            paginationProps={{
              paginationParams: params,
              setPaginationParams: setParams,
              listTotal: data?.total,
            }}
            totalItemsPerPageOptions={[10, 25, 50]}
          />
        </Page.Footer>
      </Page>
      <GetPositionPermissinDialog />
    </>
  );
};
