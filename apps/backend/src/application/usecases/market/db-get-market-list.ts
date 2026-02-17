import { inject, injectable } from 'tsyringe';
import type { GetMarketListRepository } from '../../contracts';
import {
  type Either,
  type GetMarketList,
  type GetMarketListParams,
  type GetMarketListResult,
  left,
  right,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

const { marketRepositories } = injection.infra;

@injectable()
export class DbGetMarketList implements GetMarketList {
  constructor(
    @inject(marketRepositories)
    private readonly repositories: GetMarketListRepository,
  ) {}

  execute = async ({
    search,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetMarketListParams): Promise<
    Either<UnexpectedError, GetMarketListResult>
  > => {
    try {
      const marketCount = await this.repositories.count({
        search,
      });

      const response: GetMarketListResult = {
        total: marketCount,
        markets: [],
      };

      if (marketCount > 0) {
        const markets = await this.repositories.getAll({
          search,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
        });

        response.markets = markets;
      }

      return right(response);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
