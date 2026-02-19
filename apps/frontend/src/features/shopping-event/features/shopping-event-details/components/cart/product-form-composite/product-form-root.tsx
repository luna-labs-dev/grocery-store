import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type FormInput,
  type FormOutput,
  formInputSchema,
  ProductFormProvider,
} from './product-form-context';
import type {
  AddProductToCartSuccessResult,
  Product,
} from '@/features/shopping-event/domain';
import {
  useAddProductCartMutation,
  useUpdateProductInCartMutation,
} from '@/features/shopping-event/infrastructure';

interface ProductFormRootProps {
  shoppingEventId: string;
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}

export const ProductFormRoot = ({
  shoppingEventId,
  product,
  onSuccess,
  onCancel,
  children,
}: ProductFormRootProps) => {
  const [isWholesale, setIsWholesale] = useState<boolean>(false);
  const isUpdate = !!product;

  useEffect(() => {
    setIsWholesale(!!product && !!product.wholesaleMinAmount);
  }, [product]);

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(formInputSchema),
    mode: 'onChange',
    defaultValues: isUpdate
      ? {
          name: product.name,
          amount: product.amount,
          wholesaleMinAmount: product.wholesaleMinAmount,
          price: product.price,
          wholesalePrice: product.wholesalePrice,
        }
      : {
          name: '',
          amount: 0,
          wholesaleMinAmount: 0,
          price: 0,
          wholesalePrice: 0,
        },
  });

  const { handleSubmit, reset } = form;

  const { mutateAsync: mutateAddProductAsync, isPending: isAdding } =
    useAddProductCartMutation({ shoppingEventId });
  const { mutateAsync: mutateUpdateProductAsync, isPending: isUpdating } =
    useUpdateProductInCartMutation({ shoppingEventId });

  const isSubmitting = isAdding || isUpdating;

  const onSubmit = handleSubmit(async (values: FormInput) => {
    let success: AddProductToCartSuccessResult | boolean;
    if (isUpdate) {
      await mutateUpdateProductAsync({
        shoppingEventId,
        productId: product.id,
        params: {
          name: values.name,
          amount: values.amount,
          price: values.price,
          wholesaleMinAmount: isWholesale
            ? values.wholesaleMinAmount
            : undefined,
          wholesalePrice: isWholesale ? values.wholesalePrice : undefined,
        },
      });

      success = true;
    } else {
      success = await mutateAddProductAsync({
        shoppingEventId,
        params: {
          name: values.name,
          amount: values.amount,
          price: values.price,
          wholesaleMinAmount: isWholesale
            ? values.wholesaleMinAmount
            : undefined,
          wholesalePrice: isWholesale ? values.wholesalePrice : undefined,
        },
      });
    }

    if (success) {
      reset();
      onSuccess?.();
    }
  });

  return (
    <ProductFormProvider
      value={{
        form,
        isWholesale,
        setIsWholesale,
        isSubmitting,
        isUpdate,
        onCancel,
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-col h-full w-full">
        {children}
      </form>
    </ProductFormProvider>
  );
};
