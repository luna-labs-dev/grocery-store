import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../contracts';
import {
  type Either,
  EmptyCartError,
  type EndShoppingEvent,
  type EndShoppingEventErrors,
  type EndShoppingEventParams,
  left,
  right,
  type ShoppingEvent,
  ShoppingEventAlreadyEndedError,
  ShoppingEventNotFoundError,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

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
  }: EndShoppingEventParams): Promise<
    Either<EndShoppingEventErrors, ShoppingEvent>
  > => {
    try {
      // Get Shopping Event by Id
      const shoppingEvent = await this.shoppingRepository.getById({
        shoppingEventId,
        familyId,
      });

      // Returns ShoppingEventNotFoundError if ShoppingEvent is undefined
      if (!shoppingEvent) {
        return left(new ShoppingEventNotFoundError());
      }

      if (shoppingEvent.status !== 'ONGOING') {
        return left(
          new ShoppingEventAlreadyEndedError(
            shoppingEvent.status,
            shoppingEvent.id,
          ),
        );
      }

      if (shoppingEvent.products.getItems().length <= 0) {
        return left(new EmptyCartError());
      }

      // Update ShoppingEvent object with new values
      shoppingEvent.end(totalPaid);

      // Update ShoppingEvent to the database
      await this.shoppingRepository.update(shoppingEvent);

      // Returns Updated ShoppingEvent
      return right(shoppingEvent);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
