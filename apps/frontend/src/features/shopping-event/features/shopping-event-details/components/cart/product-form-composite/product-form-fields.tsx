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
import { handleAmountChange } from '@/domain';

export const ProductFormFields = () => {
  const { form, isWholesale, setIsWholesale } = useProductFormContext();
  const { control } = form;

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
        render={({ field: { onChange, value, ...field }, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Quantidade</FieldLabel>
            <Input
              {...field}
              type="text"
              aria-invalid={fieldState.invalid}
              placeholder="Quantidade de Produto(s)"
              value={value !== undefined ? String(value).replace(',', '.') : ''}
              onChange={(e) => {
                handleAmountChange({
                  changeFn: onChange,
                  value: e.target.value,
                  type: 'decimal',
                  maxDecimals: 3,
                });
              }}
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
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Quantidade mín. atacado</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Quantidade mín. atacado"
                  onChange={(event) =>
                    handleAmountChange({
                      changeFn: onChange,
                      value: event.target.value,
                      type: 'integer',
                    })
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
