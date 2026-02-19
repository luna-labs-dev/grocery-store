import { createContext, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const FormInputSchema = z.object({
  name: z.string().min(2),
  amount: z.coerce.number().gt(0),
  wholesaleMinAmount: z.coerce.number().optional(),
  price: z.coerce.number().min(0.01),
  wholesalePrice: z.coerce.number().optional(),
});

export type FormInput = z.input<typeof FormInputSchema>;
export type FormOutput = z.output<typeof FormInputSchema>;

interface ProductFormContextValue {
  form: UseFormReturn<FormInput>;
  isWholesale: boolean;
  setIsWholesale: (value: boolean) => void;
  isSubmitting: boolean;
  isUpdate: boolean;
  onCancel?: () => void;
}

const ProductFormContext = createContext<ProductFormContextValue | undefined>(
  undefined,
);

export const ProductFormProvider = ProductFormContext.Provider;

export const useProductFormContext = () => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error(
      'useProductFormContext must be used within a ProductFormProvider',
    );
  }
  return context;
};
