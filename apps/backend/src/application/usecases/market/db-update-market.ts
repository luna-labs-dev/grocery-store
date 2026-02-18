import { inject, injectable } from 'tsyringe';
import type {
  GetMarketByCodeRepository,
  GetMarketByIdRepository,
  UpdateMarketRepository,
} from '../../contracts';
import {
  type Either,
  left,
  type Market,
  MarketAlreadyExistsError,
  MarketNotFoundError,
  right,
  UnexpectedError,
  type UpdateMarket,
  type UpdateMarketErrors,
  type UpdateMarketParams,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

export type UpdateMarketRepositories = GetMarketByCodeRepository &
  GetMarketByIdRepository &
  UpdateMarketRepository;

const { infra } = injection;
@injectable()
export class DbUpdateMarket implements UpdateMarket {
  constructor(
    @inject(infra.marketRepositories)
    private readonly repositories: UpdateMarketRepositories,
  ) {}

  execute = async ({
    name,
    marketId,
  }: UpdateMarketParams): Promise<Either<UpdateMarketErrors, Market>> => {
    try {
      // GetMarketById
      const market = await this.repositories.getById({ id: marketId });

      // Return Market not found if No market is returned
      if (!market) {
        return left(new MarketNotFoundError(marketId));
      }

      // Update Market Entity with new values
      market.update({ name });

      // Search by market Code
      const marketWithSameCode = await this.repositories.getByCode({
        code: market.code,
      });

      if (marketWithSameCode && marketWithSameCode.id !== marketId) {
        return left(new MarketAlreadyExistsError());
      }

      // Update Market in the Database
      await this.repositories.update(market);

      // Return Updated Market
      return right(market);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
