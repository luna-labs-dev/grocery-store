import { inject, injectable } from 'tsyringe';
import type {
  AddMarketRepository,
  GetMarketListRepository,
  Places,
} from '../../contracts';
import {
  type Either,
  type GetMarketList,
  type GetMarketListParams,
  type GetMarketListPossibleErrors,
  type GetMarketListResult,
  left,
  Market,
  MarketListSearchError,
  right,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { marketRepositories, places } = injection.infra;

@injectable()
export class DbGetMarketList implements GetMarketList {
  constructor(
    @inject(marketRepositories)
    private readonly repositories: GetMarketListRepository &
      AddMarketRepository,
    @inject(places) private readonly places: Places,
  ) {}

  execute = async (
    params: GetMarketListParams,
  ): Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>> => {
    try {
      const { expand } = params;
      console.log({ expand });
      if (expand) {
        return await this.googleSearch(params);
      }

      return await this.databaseSearch(params);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };

  private async databaseSearch(
    params: GetMarketListParams,
  ): Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>> {
    const { search, location, pageIndex, pageSize, orderBy, orderDirection } =
      params;
    const marketCount = await this.repositories.count({
      search,
      location,
    });

    if (marketCount === 0) {
      return right({
        total: 0,
        markets: [],
      });
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

    return right(response);
  }

  private async googleSearch(
    params: GetMarketListParams,
  ): Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>> {
    const { location } = params;

    if (!location) {
      return left(new MarketListSearchError());
    }

    const googleMarkets = await this.places.getNearByPlaces({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: location.radius,
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
    const markets = await this.repositories.addMany({
      markets: marketsToAdd,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    const response: GetMarketListResult = {
      total: markets.length,
      markets,
    };

    return right(response);
  }
}
