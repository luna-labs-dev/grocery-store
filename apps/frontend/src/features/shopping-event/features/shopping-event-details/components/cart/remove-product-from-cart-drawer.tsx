'use client';

import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components';
import { Button } from '@/components/ui/button';
import { useRemoveProductFromCartMutation } from '@/features/shopping-event/infrastructure';
import { useHaptics } from '@/hooks';
import type { GetShoppingEventById200ProductsItem } from '@/infrastructure/api/types';

interface RemoveProductFromCartDrawerProps {
  children: React.ReactElement;
  shoppingEventId: string;
  product: GetShoppingEventById200ProductsItem;
}

export const RemoveProductFromCartDrawer = ({
  children,
  shoppingEventId,
  product,
}: RemoveProductFromCartDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRemoveProductFromCartMutation();
  const { selection, success, warning } = useHaptics();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) selection();
    setOpen(isOpen);
  };

  const handleRemove = async () => {
    try {
      const response = await mutateAsync({
        shoppingEventId,
        productId: product.id,
      });

      if (response) {
        success();
        setOpen(false);
      }
    } catch (_error) {
      warning();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Remover Produto</DrawerTitle>
          <DrawerDescription>
            Tem certeza que deseja remover <strong>{product.name}</strong> do
            carrinho?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            Remover
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" autoFocus>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
