import { Icon } from '@iconify/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fCurrency, fPercent, fShortenNumber } from '@/domain';
import type { ShoppingEventCalculatedTotals } from '@/features/shopping-event/domain';
import { cn } from '@/lib/utils';

interface ShoppingEventDetailsTotalsProps {
  totals: ShoppingEventCalculatedTotals;
}

// ----------------------------------------------------------------------
// Styles & Types
// ----------------------------------------------------------------------

const ACCENT_STYLES = {
  positive: {
    iconWrapper: 'bg-emerald-500/10 text-emerald-600',
    valueText: 'text-emerald-600',
  },
  negative: {
    iconWrapper: 'bg-red-500/10 text-red-600',
    valueText: 'text-red-600',
  },
  neutral: {
    iconWrapper: 'bg-muted text-muted-foreground',
    valueText: 'text-foreground',
  },
} as const;

type AccentType = keyof typeof ACCENT_STYLES;

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
  accent?: AccentType;
}

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

function StatItem({ icon, label, value, accent = 'neutral' }: StatItemProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <Card className="shadow-none border-border/60 p-2.5">
      <CardContent className="flex items-center gap-2.5 p-0">
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
            styles.iconWrapper,
          )}
        >
          <Icon icon={icon} width={18} />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-muted-foreground leading-none mb-1">
            {label}
          </span>
          <span
            className={cn(
              'text-sm font-semibold leading-tight truncate',
              styles.valueText,
            )}
          >
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

function DifferenceStatItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  const isPositive = value >= 0;

  return (
    <StatItem
      icon={icon}
      label={label}
      value={fCurrency(value)}
      accent={isPositive ? 'positive' : 'negative'}
    />
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function ShoppingEventDetailsTotals({
  totals,
}: ShoppingEventDetailsTotalsProps) {
  const showPaidStats = totals.paidValue > 0;

  const showDifferenceStats =
    showPaidStats &&
    totals.retailPaidDifferenceValue !== undefined &&
    totals.wholesalePaidDifferenceValue !== undefined;

  return (
    <div className="flex flex-col gap-6">
      <Section title="Valores">
        <StatItem
          icon="solar:delivery-bold"
          label="Atacado"
          value={fCurrency(totals.wholesaleTotal)}
        />
        <StatItem
          icon="solar:cart-large-minimalistic-bold"
          label="Varejo"
          value={fCurrency(totals.retailTotal)}
        />
        {showPaidStats && (
          <StatItem
            icon="solar:dollar-minimalistic-bold"
            label="Pago"
            value={fCurrency(totals.paidValue)}
          />
        )}
      </Section>

      <Separator />

      <Section title="Economia">
        <StatItem
          icon="solar:wallet-bold"
          label="Economia"
          value={fCurrency(totals.savingsValue)}
          accent="positive"
        />
        <StatItem
          icon="majesticons:percent"
          label="% Economizada"
          value={fPercent(totals.savingsPercentage)}
          accent="positive"
        />

        {showDifferenceStats && (
          <>
            <DifferenceStatItem
              icon="solar:graph-down-bold"
              label="Dif. Varejo"
              value={totals.retailPaidDifferenceValue ?? 0}
            />
            <DifferenceStatItem
              icon="solar:graph-up-bold"
              label="Dif. Atacado"
              value={totals.wholesalePaidDifferenceValue ?? 0}
            />
          </>
        )}
      </Section>

      <Separator />

      <Section title="Itens">
        <StatItem
          icon="solar:box-bold"
          label="Itens"
          value={fShortenNumber(totals.totalItemsDistinct)}
        />
        <StatItem
          icon="solar:layers-bold"
          label="Unidades"
          value={fShortenNumber(totals.totalItemsQuantity, 3)}
        />
        <StatItem
          icon="solar:chart-2-bold"
          label="Preço Médio/Un."
          value={fCurrency(totals.averagePricePerUnit)}
        />
      </Section>

      <Separator />

      <Section title="Faixa de Preço">
        <StatItem
          icon="solar:square-arrow-up-bold"
          label="Mais Caro"
          value={fCurrency(totals.highestPrice)}
          accent="negative"
        />
        <StatItem
          icon="solar:square-arrow-down-bold"
          label="Mais Barato"
          value={fCurrency(totals.lowestPrice)}
          accent="positive"
        />
      </Section>
    </div>
  );
}
