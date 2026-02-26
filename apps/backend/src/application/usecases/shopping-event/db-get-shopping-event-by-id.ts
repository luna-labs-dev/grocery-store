import { inject, injectable } from 'tsyringe';
import type { GetShoppingEventByIdRepository } from '../../contracts';
import type {
  GetShoppingEventById,
  GetShoppingEventByIdParams,
  ShoppingEvent,
} from '@/domain';
import {
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class DbGetShoppingEventById implements GetShoppingEventById {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly repository: GetShoppingEventByIdRepository,
  ) {}

  execute = async ({
    familyId,
    shoppingEventId,
  }: GetShoppingEventByIdParams): Promise<ShoppingEvent> => {
    try {
      const shoppingEvent = await this.repository.getById({
        shoppingEventId,
        familyId,
      });

      if (!shoppingEvent) {
        throw new ShoppingEventNotFoundException();
      }

      return shoppingEvent;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
