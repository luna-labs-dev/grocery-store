import { KeyValueWithIcon } from '@/components';
import { fCurrency } from '@/domain';
import type { ShoppingEventCalculatedTotals } from '@/features/shopping-event/domain';

interface ShoppingEventDetailsTotalsProps {
  calculatedTotals: ShoppingEventCalculatedTotals;
}

export const ShoppingEventDetailsTotals = ({
  calculatedTotals,
}: ShoppingEventDetailsTotalsProps) => {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xl font-bold ">Totais</h3>

      <div className="grid grid-cols-3 gap-4 ">
        <KeyValueWithIcon
          props={{
            title: 'Varejo',
            text: fCurrency(calculatedTotals.retailTotal),
            iconName: 'mingcute:shopping-cart-2-line',
          }}
        />
        <KeyValueWithIcon
          props={{
            title: 'Atacado',
            text: fCurrency(calculatedTotals.wholesaleTotal),
            iconName: 'mingcute:truck-line',
          }}
        />

        <KeyValueWithIcon
          props={{
            title: 'Economia',
            text: fCurrency(calculatedTotals.wholesaleSavingValue),
            iconName: 'mingcute:wallet-3-line',
          }}
        />

        <KeyValueWithIcon
          props={{
            title: 'Dif. Varejo',
            text: fCurrency(calculatedTotals.retailPaidDifferenceValue),
            iconName: 'mingcute:chart-bar-line',
          }}
        />

        <KeyValueWithIcon
          props={{
            title: 'Dif. Atacado',
            text: fCurrency(calculatedTotals.wholesalePaidDifferenceValue),
            iconName: 'mingcute:chart-bar-2-line',
          }}
        />

        <KeyValueWithIcon
          props={{
            title: 'Pago',
            text: fCurrency(calculatedTotals.paidValue),
            iconName: 'mingcute:currency-dollar-line',
          }}
        />
      </div>
    </section>
  );
};
