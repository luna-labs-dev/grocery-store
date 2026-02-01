import { useState } from 'react';
import { ProductForm } from './product-form';
import {
  FieldGroup,
  Sheet,
  SheetContent,
  SheetDescription,
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
        <SheetHeader>
          <SheetTitle>Adicionar Produto</SheetTitle>
          <SheetDescription>
            Adicionar um novo produto ao carrinho
          </SheetDescription>
        </SheetHeader>
        <FieldGroup className="p-4">
          <ProductForm shoppingEventId={shoppingEventId} setOpen={setOpen} />
        </FieldGroup>
      </SheetContent>
    </Sheet>
  );
};
