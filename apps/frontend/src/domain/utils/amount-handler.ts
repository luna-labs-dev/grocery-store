interface BaseHandleAmountChangeProps {
  changeFn: (realValue?: number | string) => void;
  value: string;
}

interface IntegerHandleAmountChangeProps extends BaseHandleAmountChangeProps {
  type: 'integer';
}

interface DecimalHandleAmountChangeProps extends BaseHandleAmountChangeProps {
  type: 'decimal';
  maxDecimals?: number;
}

export type HandleAmountChangeProps =
  | IntegerHandleAmountChangeProps
  | DecimalHandleAmountChangeProps;

const DEFAULT_MAXIMAL_DECIMALS = 3;
export const handleAmountChange = (props: HandleAmountChangeProps) => {
  const { type, value, changeFn } = props;
  if (type === 'integer') {
    const digitsOnly = value.replace(/\D/g, '');

    const numericValue = Number(digitsOnly);

    if (isNaN(numericValue) || numericValue === 0) {
      changeFn(undefined);
      return;
    }

    changeFn(numericValue);
    return;
  }

  const { maxDecimals = DEFAULT_MAXIMAL_DECIMALS } = props;

  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');

  const dotCount = (normalized.match(/\./g) || []).length;
  if (dotCount > 1) return;

  if (normalized === '' || normalized === '.') {
    changeFn(undefined);
    return;
  }

  if (normalized.split('.')[1]?.length > maxDecimals) return;

  if (normalized.endsWith('.')) {
    changeFn(normalized);
    return;
  }

  const numericValue = Number(normalized);

  if (isNaN(numericValue)) {
    changeFn(undefined);
    return;
  }

  changeFn(numericValue);
};
