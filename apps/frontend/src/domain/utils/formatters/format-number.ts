import numeral from 'numeral';

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(number !== undefined ? number : 0));
}

export function fPercent(number: InputValue) {
  return Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(number ?? 0) / 100);
}

export function fShortenNumber(number: InputValue, decimals = 2) {
  const format = number
    ? numeral(number).format(`0.${'0'.repeat(decimals)}a`)
    : '';

  const resultValue = result(format);
  return resultValue;
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format);
}

function result(format: string) {
  const [integerPart, decimalPart] = format.split('.');

  const isAllZeros = decimalPart?.split('').every((char) => char === '0');

  return isAllZeros ? integerPart : format;
}

export const milisecondsToSeconds = (miliseconds: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'unit',
    unit: 'second',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(Number(miliseconds / 1000))
    .replace(' ', '');
