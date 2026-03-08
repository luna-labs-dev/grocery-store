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

interface AddProductToCartDrawerProps {
  children: React.ReactElement;
  shoppingEventId: string;
}

export const AddProductToCartDrawer = ({
  children,
  shoppingEventId,
}: AddProductToCartDrawerProps) => {
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
          onSuccess={() => {
            success();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        >
          <DrawerHeader className="flex-none border-b p-4 text-left">
            <DrawerTitle>Adicionar Produto</DrawerTitle>
            <DrawerDescription>
              Adicionar um novo produto ao carrinho
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col ">
            <ProductFormComposite.Fields />
          </div>
          <DrawerFooter className="p-4 border-t">
            <ProductFormComposite.Actions />
          </DrawerFooter>
        </ProductFormComposite.Root>
      </DrawerContent>
    </Drawer>
  );
};
