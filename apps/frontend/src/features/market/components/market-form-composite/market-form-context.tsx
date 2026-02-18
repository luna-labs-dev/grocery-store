import { createContext, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const FormInputSchema = z.object({
  marketName: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
});

export type FormInput = z.infer<typeof FormInputSchema>;

interface MarketFormContextValue {
  form: UseFormReturn<FormInput>;
  isSubmitting: boolean;
  isUpdate: boolean;
  onFinished: () => void;
  isLoading?: boolean;
}

const MarketFormContext = createContext<MarketFormContextValue | undefined>(
  undefined,
);

export const MarketFormProvider = MarketFormContext.Provider;

export const useMarketFormContext = () => {
  const context = useContext(MarketFormContext);
  if (!context) {
    throw new Error(
      'useMarketFormContext must be used within a MarketFormProvider',
    );
  }
  return context;
};
