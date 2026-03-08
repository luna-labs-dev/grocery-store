'use client';

import { useState } from 'react';
import { EndShoppingEventForm } from './end-shopping-event-form';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components';
import { useHaptics } from '@/hooks';

interface EndShoppingEventDrawerProps {
  children: React.ReactElement;
  shoppingEventId: string;
}

export const EndShoppingEventDrawer = ({
  children,
  shoppingEventId,
}: EndShoppingEventDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { selection } = useHaptics();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) selection();
    setOpen(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar Compra</DrawerTitle>
          <DrawerDescription>
            Informe o valor total pago para finalizar este evento de compra.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <EndShoppingEventForm
            shoppingEventId={shoppingEventId}
            setOpen={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
