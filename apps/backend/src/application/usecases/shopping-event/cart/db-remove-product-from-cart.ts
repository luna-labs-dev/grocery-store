import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../../contracts';
import {
  type Either,
  left,
  ProductNotFoundError,
  type RemoveProductFromCart,
  type RemoveProductFromCartErrors,
  type RemoveProductFromCartParams,
  right,
  ShoppingEventAlreadyEndedError,
  ShoppingEventNotFoundError,
  UnexpectedError,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

type RemoveProductFromCartRepositories = GetShoppingEventByIdRepository &
  UpdateShoppingEventRepository;

const { infra } = injection;

@injectable()
export class DbRemoveProductFromCart implements RemoveProductFromCart {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly repository: RemoveProductFromCartRepositories,
  ) {}

  execute = async ({
    familyId,
    shoppingEventId,
    productId,
  }: RemoveProductFromCartParams): Promise<
    Either<RemoveProductFromCartErrors, void>
  > => {
    try {
      // Get shoppingEvent by ID
      const shoppingEvent = await this.repository.getById({
        familyId,
        shoppingEventId,
      });

      // Return ShoppingEventNotFoundError if shoppingEvent is undefined
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

      // Retrieve Product from shoppingEvent
      const product = shoppingEvent.products.getItemById(productId);

      // Return ProductNotFoundError if no product is found
      if (!product) {
        return left(new ProductNotFoundError());
      }

      // remove the product from the list
      shoppingEvent.removeProduct(product);

      // Update shoppingEvent (removing the produt) to the database
      await this.repository.update(shoppingEvent);

      // Return right void
      return right(undefined);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
