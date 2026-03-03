import { inject, injectable } from 'tsyringe';
import type {
  AddMarketRepository,
  GetMarketByIdRepository,
  GetMarketListRepository,
  Places,
} from '@/application/contracts';
import type { GetMarketByIdParams, GetMarketListParams } from '@/domain';
import { type GetMarketListResult, Market } from '@/domain';
import {
  MarketNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { marketRepositories, places } = injection.infra;

@injectable()
export class MarketService {
  constructor(
    @inject(marketRepositories)
    private readonly repositories: GetMarketListRepository &
      AddMarketRepository &
      GetMarketByIdRepository,
    @inject(places)
    private readonly placesService: Places,
  ) {}

  async getMarketList(
    params: GetMarketListParams,
  ): Promise<GetMarketListResult> {
    try {
      const { expand } = params;

      let markets = await this.databaseSearch(params);

      if (markets.markets.length === 0 || expand) {
        await this.googleSearch(params);
        markets = await this.databaseSearch(params);
      }

      return markets;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getMarketById({ marketId }: GetMarketByIdParams): Promise<Market> {
    try {
      const market = await this.repositories.getById({ id: marketId });

      if (!market) throw new MarketNotFoundException();

      return market;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  private async databaseSearch(
    params: GetMarketListParams,
  ): Promise<GetMarketListResult> {
    const { search, location, pageIndex, pageSize, orderBy, orderDirection } =
      params;
    const marketCount = await this.repositories.count({ search, location });

    if (marketCount === 0) return { total: 0, markets: [] };

    const markets = await this.repositories.getAll({
      search,
      location,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    });

    return { total: marketCount, markets };
  }

  private async googleSearch(params: GetMarketListParams): Promise<void> {
    const { location } = params;

    if (!location) return;

    const googleMarkets = await this.placesService.getNearByPlaces({
      latitude: location.latitude,
      longitude: location.longitude,
      maxResults: 20,
    });

    const marketsToAdd = googleMarkets.map((market) =>
      Market.create(
        {
          name: market.name,
          formattedAddress: market.formattedAddress,
          city: market.city,
          neighborhood: market.neighborhood,
          latitude: market.location.latitude,
          longitude: market.location.longitude,
          locationTypes: market.types,
        },
        market.id,
      ),
    );

    if (marketsToAdd.length === 0) return;

    await this.repositories.addMany({
      markets: marketsToAdd,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }
}
