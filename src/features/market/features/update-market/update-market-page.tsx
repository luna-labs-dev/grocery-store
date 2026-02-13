import { MarketForm } from '../../components';

export const UpdateMarketPage = ({ marketId }: { marketId: string }) => {
  return (
    <div className="py-4 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar Mercado</h1>
      <MarketForm.Root marketId={marketId}>
        <MarketForm.Fields />
        <div className="mt-8 flex justify-end">
          <MarketForm.Actions />
        </div>
      </MarketForm.Root>
    </div>
  );
};
