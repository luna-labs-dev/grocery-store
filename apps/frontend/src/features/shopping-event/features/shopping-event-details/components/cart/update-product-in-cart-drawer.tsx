'use client';

import { useState } from 'react';
import { ProductFormComposite } from './product-form-composite';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components';
import { useHaptics } from '@/hooks';
import type { GetShoppingEventById200ProductsItem } from '@/infrastructure/api/types';

interface UpdateProductInCartDrawerProps {
  children: React.ReactElement;
  shoppingEventId: string;
  product: GetShoppingEventById200ProductsItem;
}

export const UpdateProductInCartDrawer = ({
  children,
  shoppingEventId,
  product,
}: UpdateProductInCartDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { selection, success } = useHaptics();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) selection();
    setOpen(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="w-full">
        <ProductFormComposite.Root
          shoppingEventId={shoppingEventId}
          product={product}
          onSuccess={() => {
            success();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        >
          <DrawerHeader className="flex-none border-b p-6 text-left">
            <DrawerTitle>Editar Produto</DrawerTitle>
            <DrawerDescription>
              Atualize as informações do produto no carrinho
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col ">
            <ProductFormComposite.Fields />
          </div>
          <DrawerFooter className="p-4 pb-6 border-t">
            <ProductFormComposite.Actions />
          </DrawerFooter>
        </ProductFormComposite.Root>
      </DrawerContent>
    </Drawer>
  );
};
