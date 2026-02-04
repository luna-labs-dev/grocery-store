import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  KeyValueWithIcon,
} from '@/components';
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

      <div className="w-fit flex flex-col gap-2 grow">
        <div className="w-fit flex flex-wrap gap-4 pe-8">
          <KeyValueWithIcon
            props={{
              title: 'Total',
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
              title: 'Pago',
              text: fCurrency(calculatedTotals.paidValue),
              iconName: 'mingcute:currency-dollar-line',
            }}
          />
        </div>
        <Accordion type="single" collapsible className="w-full rounded-lg">
          <AccordionItem value={'details'} className="py-0">
            <AccordionTrigger className="gap-2">Mais totais</AccordionTrigger>
            <AccordionContent className="flex gap-4">
              <KeyValueWithIcon
                props={{
                  title: 'Varejo',
                  text: fCurrency(calculatedTotals.retailTotal),
                  iconName: 'mingcute:shopping-cart-2-line',
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
                  text: fCurrency(
                    calculatedTotals.wholesalePaidDifferenceValue,
                  ),
                  iconName: 'mingcute:chart-bar-2-line',
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
