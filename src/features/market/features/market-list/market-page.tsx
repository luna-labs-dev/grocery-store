import { Link } from '@tanstack/react-router';
import { NewMarketDialog } from '../new-market/new-market-dialog';
import { MarketList } from './components/market-list';
import { Button } from '@/components';

export const MarketPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-end gap-2 pt-2 sm:gap-0 sm:flex-row">
        <div>
          <NewMarketDialog
            options={{
              triggerName: 'Novo Mercado',
            }}
          />
          <Link to={'/app/market/new-market'} replace className="md:hidden">
            <Button className="w-full">Novo Mercado</Button>
          </Link>
        </div>
      </div>
      <MarketList />
    </div>
  );
};
