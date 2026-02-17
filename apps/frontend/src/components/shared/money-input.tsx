import { useReducer } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from '@/components';

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  placeholder: string;
};

// Brazilian currency config
const moneyFormatter = Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',

  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const addDecimal = (number: number) => {
  const str = number.toString();
  if (str.length === 1) {
    return Number(`0.0${str}`);
  }
  if (str.length === 2) {
    return Number(`0.${str}`);
  }

  const wholePart = str.slice(0, str.length - 2);
  const decimalPart = str.slice(str.length - 2);
  return Number(`${wholePart}.${decimalPart}`);
};

export const MoneyInput = (props: TextInputProps) => {
  const initialValue = props.form.getValues()[props.name]
    ? moneyFormatter.format(props.form.getValues()[props.name])
    : '';

  const [value, setValue] = useReducer((_: any, next: number) => {
    if (next === 0) {
      return '';
    }

    return moneyFormatter.format(next);
  }, initialValue);

  function handleChange(
    realChangeFn: (realValue: number) => void,
    formattedValue: string,
  ) {
    const textDigits = formattedValue.trim().replace(/\D/g, '');

    let digits = Number(textDigits);
    digits = addDecimal(digits);
    realChangeFn(digits);
    setValue(digits);
  }

  return (
    <Controller
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid}>
          <FieldLabel>{props.label}</FieldLabel>
          <Input
            {...field}
            type="text"
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
            onChange={(ev) => {
              handleChange(field.onChange, ev.target.value);
            }}
            onKeyUp={(ev) => {
              ev.currentTarget.setSelectionRange(value.length, value.length);
            }}
            value={value}
          />
          {fieldState.invalid ? (
            <FieldError>{fieldState.error?.message}</FieldError>
          ) : (
            props.description && (
              <FieldDescription>{props.description}</FieldDescription>
            )
          )}
        </Field>
      )}
    />
  );
};
