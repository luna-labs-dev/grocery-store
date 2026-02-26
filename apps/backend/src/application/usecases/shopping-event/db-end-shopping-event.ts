import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../contracts';
import type {
  EndShoppingEvent,
  EndShoppingEventParams,
  ShoppingEvent,
} from '@/domain';
import {
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

type EndShoppingEventRepositories = GetShoppingEventByIdRepository &
  UpdateShoppingEventRepository;

const { infra } = injection;
@injectable()
export class DbEndShoppingEvent implements EndShoppingEvent {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingRepository: EndShoppingEventRepositories,
  ) {}

  execute = async ({
    shoppingEventId,
    familyId,
    totalPaid,
  }: EndShoppingEventParams): Promise<ShoppingEvent> => {
    try {
      // Get Shopping Event by Id
      const shoppingEvent = await this.shoppingRepository.getById({
        shoppingEventId,
        familyId,
      });

      // Returns ShoppingEventNotFoundError if ShoppingEvent is undefined
      if (!shoppingEvent) {
        throw new ShoppingEventNotFoundException();
      }

      if (shoppingEvent.status !== 'ONGOING') {
        throw new ShoppingEventAlreadyEndedException();
      }

      if (shoppingEvent.products.getItems().length <= 0) {
        throw new ShoppingEventEmptyCartException();
      }

      // Update ShoppingEvent object with new values
      shoppingEvent.end(totalPaid);

      // Update ShoppingEvent to the database
      await this.shoppingRepository.update(shoppingEvent);

      // Returns Updated ShoppingEvent
      return shoppingEvent;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
