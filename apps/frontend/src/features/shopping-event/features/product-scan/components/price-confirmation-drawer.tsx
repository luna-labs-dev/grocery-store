import { ProductFormActions } from '../../shopping-event-details/components/cart/product-form-composite/product-form-actions';
import { ProductFormFields } from '../../shopping-event-details/components/cart/product-form-composite/product-form-fields';
import { ProductFormRoot } from '../../shopping-event-details/components/cart/product-form-composite/product-form-root';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { GetShoppingEventById200ProductsItem } from '@/infrastructure/api/types/get-shopping-event-by-id200-products-item';

interface PriceConfirmationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingEventId: string;
  productData?: {
    name: string;
    brand?: string;
    imageUrl?: string;
    price?: number;
    weightInGrams?: number;
  };

  onSuccess: () => void;
}

export const PriceConfirmationDrawer = ({
  isOpen,
  onClose,
  shoppingEventId,
  productData,
  onSuccess,
}: PriceConfirmationDrawerProps) => {
  if (!productData) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Confirm Price</DrawerTitle>
            <DrawerDescription>
              Confirm the Price for {productData.name}
              {productData.brand && ` (${productData.brand})`}
              {productData.weightInGrams && (
                <div className="text-primary font-semibold">
                  Peso detectado: {productData.weightInGrams}g
                </div>
              )}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <ProductFormRoot
              shoppingEventId={shoppingEventId}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
              product={
                productData as unknown as GetShoppingEventById200ProductsItem
              }
            >
              <ProductFormFields />
              <DrawerFooter className="px-0 pt-6">
                <ProductFormActions />
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </ProductFormRoot>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
