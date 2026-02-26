import { inject, injectable } from 'tsyringe';
import type {
  AddMarketRepository,
  GetMarketListRepository,
  Places,
} from '../../contracts';
import {
  type GetMarketList,
  type GetMarketListParams,
  type GetMarketListResult,
  Market,
} from '@/domain';
import { UnexpectedException } from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { marketRepositories, places } = injection.infra;

@injectable()
export class DbGetMarketList implements GetMarketList {
  constructor(
    @inject(marketRepositories)
    private readonly repositories: GetMarketListRepository &
      AddMarketRepository,
    @inject(places) private readonly placesService: Places,
  ) {}

  execute = async (
    params: GetMarketListParams,
  ): Promise<GetMarketListResult> => {
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
  };

  private async databaseSearch(
    params: GetMarketListParams,
  ): Promise<GetMarketListResult> {
    const { search, location, pageIndex, pageSize, orderBy, orderDirection } =
      params;
    const marketCount = await this.repositories.count({
      search,
      location,
    });

    if (marketCount === 0) {
      return {
        total: 0,
        markets: [],
      };
    }
    const markets = await this.repositories.getAll({
      search,
      location,
      pageIndex,
      pageSize,
      orderBy,
      orderDirection,
    });

    const response: GetMarketListResult = {
      total: marketCount,
      markets,
    };

    return response;
  }

  private async googleSearch(params: GetMarketListParams): Promise<void> {
    const { location } = params;

    if (!location) {
      return;
    }

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

    if (marketsToAdd.length === 0) {
      return;
    }
    await this.repositories.addMany({
      markets: marketsToAdd,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    return;
  }
}
