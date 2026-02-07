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

interface AddProductToCartSheetProps {
  children: React.ReactElement;
  shoppingEventId: string;
}
export const AddProductToCartSheet = ({
  children,
  shoppingEventId,
}: AddProductToCartSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        style={{
          width: '100vw',
        }}
      >
        <ProductFormComposite.Root
          shoppingEventId={shoppingEventId}
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
