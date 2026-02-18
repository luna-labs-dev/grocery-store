import { Controller } from 'react-hook-form';
import { useProductFormContext } from './product-form-context';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Label,
  MoneyInput,
  Switch,
} from '@/components';

export const ProductFormFields = () => {
  const { form, isWholesale, setIsWholesale } = useProductFormContext();
  const { control } = form;

  const handleAmountChange = (
    realChangeFn: (realValue?: number) => void,
    value: string,
  ) => {
    const textDigits = value.trim().replace(/\D/g, '');
    const digits = Number(textDigits);
    digits === 0 ? realChangeFn(undefined) : realChangeFn(digits);
  };

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Nome</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="Nome do Produto"
            />
            {fieldState.invalid ? (
              <FieldError>{fieldState.error?.message}</FieldError>
            ) : (
              <FieldDescription>Nome do produto</FieldDescription>
            )}
          </Field>
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Quantidade</FieldLabel>
            <Input
              {...field}
              type="number"
              aria-invalid={fieldState.invalid}
              placeholder="Quantidade de Produto(s)"
            />
            {fieldState.invalid ? (
              <FieldError>{fieldState.error?.message}</FieldError>
            ) : (
              <FieldDescription>Quantidade do produto</FieldDescription>
            )}
          </Field>
        )}
      />

      <MoneyInput
        form={form}
        label="Preço"
        name="price"
        description="Preço do produto"
        placeholder="Valor do produto"
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="wholesale-mode"
          checked={isWholesale}
          onCheckedChange={setIsWholesale}
        />
        <Label htmlFor="wholesale-mode">atacado</Label>
      </div>

      {isWholesale && (
        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="wholesaleMinAmount"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Quantidade mín. atacado</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Quantidade mín. atacado"
                  onChange={(event) =>
                    handleAmountChange(field.onChange, event.target.value)
                  }
                />
                {fieldState.invalid ? (
                  <FieldError>{fieldState.error?.message}</FieldError>
                ) : (
                  <FieldDescription>
                    Quantidade mínima para atacado
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <MoneyInput
            form={form}
            label="Preço atacado"
            name="wholesalePrice"
            description="Preço do produto atacado"
            placeholder="Valor do produto"
          />
        </div>
      )}
    </>
  );
};
