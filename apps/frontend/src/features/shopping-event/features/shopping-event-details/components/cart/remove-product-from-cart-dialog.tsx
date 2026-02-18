import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components';
import { fCurrency } from '@/domain';
import type { Product } from '@/features/shopping-event/domain';
import { useRemoveProductFromCartMutation } from '@/features/shopping-event/infrastructure';

interface RemoveProductFromCartDialogProps {
  children: React.ReactElement;
  shoppingEventId: string;
  product: Product;
}
export const RemoveProductFromCartDialog = ({
  children,
  shoppingEventId,
  product,
}: RemoveProductFromCartDialogProps) => {
  const { mutateAsync } = useRemoveProductFromCartMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover produto do carrinho?</AlertDialogTitle>
          <AlertDialogDescription>{`${product.name} - ${product.amount} x ${
            product.amount >= (product.wholesaleMinAmount ?? 0) &&
            !!product.wholesalePrice
              ? fCurrency(product.wholesalePrice)
              : fCurrency(product.price)
          }`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await mutateAsync({
                shoppingEventId,
                productId: product.id,
              });
            }}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
