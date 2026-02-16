import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  DollarSign,
  Layers,
  Package,
  Percent,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Truck,
  Wallet,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fCurrency, fPercent, fShortenNumber } from '@/domain';
import type { ShoppingEventCalculatedTotals } from '@/features/shopping-event/domain';
import { cn } from '@/lib/utils';

interface ShoppingEventDetailsTotalsProps {
  totals: ShoppingEventCalculatedTotals;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: 'positive' | 'negative' | 'neutral';
}

function StatItem({ icon, label, value, accent = 'neutral' }: StatItemProps) {
  return (
    <Card className="shadow-none border-border/60 p-2.5 ">
      <CardContent className="flex items-center gap-2.5 p-0">
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
            accent === 'positive' && 'bg-emerald-500/10 text-emerald-600',
            accent === 'negative' && 'bg-red-500/10 text-red-600',
            accent === 'neutral' && 'bg-muted text-muted-foreground',
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-muted-foreground leading-none">
            {label}
          </span>
          <span
            className={cn(
              'text-sm font-semibold leading-tight truncate',
              accent === 'positive' && 'text-emerald-600',
              accent === 'negative' && 'text-red-600',
            )}
          >
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

export function ShoppingEventDetailsTotals({
  totals,
}: ShoppingEventDetailsTotalsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section 1: Valores Principais */}
      <Section title="Valores">
        <StatItem
          icon={<Truck className="h-3.5 w-3.5" />}
          label="Atacado"
          value={fCurrency(totals.wholesaleTotal)}
        />
        <StatItem
          icon={<ShoppingCart className="h-3.5 w-3.5" />}
          label="Varejo"
          value={fCurrency(totals.retailTotal)}
        />
        {totals.paidValue > 0 && (
          <StatItem
            icon={<DollarSign className="h-3.5 w-3.5" />}
            label="Pago"
            value={fCurrency(totals.paidValue)}
          />
        )}
      </Section>

      <Separator />

      {/* Section 2: Economia & Diferenças */}
      <Section title="Economia">
        <StatItem
          icon={<Wallet className="h-3.5 w-3.5" />}
          label="Economia"
          value={fCurrency(totals.savingsValue)}
          accent="positive"
        />
        <StatItem
          icon={<Percent className="h-3.5 w-3.5" />}
          label="% Economizada"
          value={fPercent(totals.savingsPercentage)}
          accent="positive"
        />
        {totals.paidValue > 0 &&
          totals.retailPaidDifferenceValue !== undefined &&
          totals.wholesalePaidDifferenceValue !== undefined && (
            <>
              <StatItem
                icon={<TrendingDown className="h-3.5 w-3.5" />}
                label="Dif. Varejo"
                value={fCurrency(totals.retailPaidDifferenceValue)}
                accent={
                  totals.retailPaidDifferenceValue >= 0
                    ? 'positive'
                    : 'negative'
                }
              />
              <StatItem
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Dif. Atacado"
                value={fCurrency(totals.wholesalePaidDifferenceValue)}
                accent={
                  totals.wholesalePaidDifferenceValue >= 0
                    ? 'positive'
                    : 'negative'
                }
              />
            </>
          )}
      </Section>

      <Separator />

      {/* Section 3: Itens & Quantidades */}
      <Section title="Itens">
        <StatItem
          icon={<Package className="h-3.5 w-3.5" />}
          label="Itens"
          value={fShortenNumber(totals.totalItemsDistinct, 3)}
        />
        <StatItem
          icon={<Layers className="h-3.5 w-3.5" />}
          label="Unidades"
          value={fShortenNumber(totals.totalItemsQuantity, 3)}
        />
        <StatItem
          icon={<BarChart3 className="h-3.5 w-3.5" />}
          label="Preço Medio/Un."
          value={fCurrency(10)} // TODO: implementar
        />
      </Section>

      <Separator />

      {/* Section 4: Extremos de Preço */}
      <Section title="Faixa de Preco">
        <StatItem
          icon={<ArrowUpCircle className="h-3.5 w-3.5" />}
          label="Mais Caro"
          value={fCurrency(totals.highestPrice)}
          accent="negative"
        />
        <StatItem
          icon={<ArrowDownCircle className="h-3.5 w-3.5" />}
          label="Mais Barato"
          value={fCurrency(totals.lowestPrice)}
          accent="positive"
        />
      </Section>
    </div>
  );
}
