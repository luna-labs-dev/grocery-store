import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components';
import { useGetMarketListQuery } from '@/features/market/infrastructure';
import { useStartShoppingEventMutation } from '@/features/shopping-event/infrastructure';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const StartShoppingEvent = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useStartShoppingEventMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { data, isLoading } = useGetMarketListQuery({
    pageIndex: 0,
    pageSize: 50,
    orderBy: 'createdAt',
    orderDirection: 'asc',
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Iniciar Evento de Compra</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar Evento de Compra</DialogTitle>
          <DialogDescription>
            Selecione um mercado para iniciar o evento de compra
          </DialogDescription>
        </DialogHeader>
        <Combobox
          isLoading={isLoading}
          items={
            data?.items.map((item) => ({
              label: item.name,
              value: item.id,
            })) ?? []
          }
          value={value}
          onValueChange={setValue}
        >
          <ComboboxTrigger placeHolder="Selecione um mercado" className="w-full" />
          <ComboboxContent
            placeHolder="Selecione um mercado"
            renderEmpty="Nenhum mercado encontrado"
            className="w-[--radix-popover-trigger-width]"
          />
        </Combobox>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!value}
            onClick={async () => {
              const shoppingEvent = await mutateAsync({ marketId: value });
              navigate(`/shopping-event/ongoing/${shoppingEvent.id}`, { replace: true });
            }}
          >
            Iniciar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
