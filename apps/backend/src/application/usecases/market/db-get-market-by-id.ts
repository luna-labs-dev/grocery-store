import { inject, injectable } from 'tsyringe';
import type { GetMarketByIdRepository } from '../../contracts';
import type { GetMarketById, GetMarketByIdParams, Market } from '@/domain';
import {
  MarketNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbGetMarketById implements GetMarketById {
  constructor(
    @inject(infra.marketRepositories)
    private readonly repository: GetMarketByIdRepository,
  ) {}

  execute = async ({ marketId }: GetMarketByIdParams): Promise<Market> => {
    try {
      const market = await this.repository.getById({
        id: marketId,
      });

      if (!market) {
        throw new MarketNotFoundException();
      }

      return market;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
