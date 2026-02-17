import { MarketForm } from '../../components';
import { Page } from '@/components/layout/page-layout';

export const NewMarketPage = () => {
  return (
    <Page className="p-4">
      <MarketForm.Root className="gap-4">
        <Page.Content>
          <MarketForm.Fields />
        </Page.Content>
        <Page.Footer className="flex justify-end">
          <MarketForm.Actions />
        </Page.Footer>
      </MarketForm.Root>
    </Page>
  );
};
