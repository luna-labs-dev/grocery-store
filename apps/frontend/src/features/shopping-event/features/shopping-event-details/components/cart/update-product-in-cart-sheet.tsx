import { useState } from 'react';
import { ProductFormComposite } from './product-form-composite';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components';
import type { Product } from '@/features/shopping-event/domain';

interface UpdateProductInCartSheetProps {
  children: React.ReactElement;
  shoppingEventId: string;
  product: Product;
}
export const UpdateProductInCartSheet = ({
  children,
  shoppingEventId,
  product,
}: UpdateProductInCartSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full">
        <ProductFormComposite.Root
          shoppingEventId={shoppingEventId}
          product={product}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <SheetHeader className="flex-none border-b p-6 text-left">
            <SheetTitle>Adicionar Produto</SheetTitle>
            <SheetDescription>
              Adicionar um novo produto ao carrinho
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col ">
            <ProductFormComposite.Fields />
          </div>
          <SheetFooter className="p-4 pb-6">
            <ProductFormComposite.Actions />
          </SheetFooter>
        </ProductFormComposite.Root>
      </SheetContent>
    </Sheet>
  );
};
