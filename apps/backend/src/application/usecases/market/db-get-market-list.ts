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
    @inject(places) private readonly placesService: Places,
  ) {}

  execute = async (
    params: GetMarketListParams,
  ): Promise<Either<GetMarketListPossibleErrors, GetMarketListResult>> => {
    try {
      const { expand } = params;

      let result = await this.databaseSearch(params);
      if (result.isLeft()) {
        return result;
      }

      const { markets } = result.value;

      if (markets.length === 0 || expand) {
        await this.googleSearch(params);
        result = await this.databaseSearch(params);
      }

      return result;
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
  ): Promise<Either<GetMarketListPossibleErrors, void>> {
    const { location } = params;

    if (!location) {
      return left(new MarketListSearchError());
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
      return right(undefined);
    }
    await this.repositories.addMany({
      markets: marketsToAdd,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    return right(undefined);
  }
}
