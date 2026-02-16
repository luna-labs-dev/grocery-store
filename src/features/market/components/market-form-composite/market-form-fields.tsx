import { Controller } from 'react-hook-form';
import { useMarketFormContext } from './market-form-context';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from '@/components';

export const MarketFormFields = () => {
  const { form, isSubmitting, isLoading } = useMarketFormContext();
  const { control } = form;

  return (
    <Controller
      control={control}
      name="marketName"
      render={({ field, fieldState }) => {
        return (
          <Field>
            <FieldLabel aria-invalid={fieldState.invalid}>
              Nome do mercado
            </FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder={isLoading ? 'Carregando...' : 'Nome do mercado'}
              disabled={isSubmitting}
            />
            {fieldState.invalid ? (
              <FieldError>{fieldState.error?.message}</FieldError>
            ) : (
              <FieldDescription>Digite aqui o nome do mercado</FieldDescription>
            )}
          </Field>
        );
      }}
    />
  );
};
