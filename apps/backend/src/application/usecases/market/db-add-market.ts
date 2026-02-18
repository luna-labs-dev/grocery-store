import { inject, injectable } from 'tsyringe';
import type {
  AddMarketRepository,
  GetMarketByCodeRepository,
} from '@/application';
import {
  type AddMarket,
  type AddMarketErrors,
  type AddMarketParams,
  type Either,
  left,
  Market,
  MarketAlreadyExistsError,
  right,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

export type AddMarketRepositories = AddMarketRepository &
  GetMarketByCodeRepository;

const { infra } = injection;

@injectable()
export class DbAddMarket implements AddMarket {
  constructor(
    @inject(infra.marketRepositories)
    private readonly repository: AddMarketRepositories,
  ) {}

  execute = async ({
    marketName,
    user,
  }: AddMarketParams): Promise<Either<AddMarketErrors, Market>> => {
    try {
      const market = Market.create({
        name: marketName,
        createdAt: new Date(),
        createdBy: user,
      });

      const marketExists = await this.repository.getByCode({
        code: market.code,
      });

      if (marketExists) {
        return left(new MarketAlreadyExistsError());
      }

      await this.repository.add(market);

      return right(market);
    } catch (error) {
      console.error(error);
      return left(new UnexpectedError());
    }
  };
}
