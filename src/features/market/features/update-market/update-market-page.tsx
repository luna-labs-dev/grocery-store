import { MarketForm } from '../../components';

export const UpdateMarketPage = ({ marketId }: { marketId: string }) => {
  return (
    <div className="py-4">
      <MarketForm updateProps={{ marketId }} />
    </div>
  );
};
