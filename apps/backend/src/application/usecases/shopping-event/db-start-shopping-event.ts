import { inject, injectable } from 'tsyringe';
import type {
  AddShoppingEventRepository,
  GetFamilyByIdRepository,
  GetMarketByIdRepository,
} from '@/application/contracts';
import {
  type Either,
  left,
  MarketNotFoundError,
  right,
  ShoppingEvent,
  type StartShoppingEvent,
  type StartShoppingEventErrors,
  type StartShoppingEventParams,
  UnexpectedError,
} from '@/domain';
import { Products } from '@/domain/entities/products';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;
@injectable()
export class DbStartShoppingEvent implements StartShoppingEvent {
  constructor(
    @inject(infra.marketRepositories)
    private readonly marketRepository: GetMarketByIdRepository,
    @inject(infra.familyRepositories)
    readonly _familyRepository: GetFamilyByIdRepository,
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: AddShoppingEventRepository,
  ) {}

  execute = async ({
    user,
    familyId,
    marketId,
  }: StartShoppingEventParams): Promise<
    Either<StartShoppingEventErrors, ShoppingEvent>
  > => {
    try {
      // Calls GetMarketById
      const market = await this.marketRepository.getById({
        id: marketId,
      });

      // If Market doesnt exists returns MarketNotFoundError
      if (!market) {
        return left(new MarketNotFoundError());
      }

      // Create ShoppingEvent instance
      const shoppingEvent = ShoppingEvent.create({
        familyId,
        marketId,
        market,
        status: 'ONGOING',
        createdAt: new Date(),
        createdBy: user,
        products: Products.create([]),
      });

      // Calls AddShoppingEvent repository

      await this.shoppingEventRepository.add(shoppingEvent);

      // Returns ShoppingEvent
      return right(shoppingEvent);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
