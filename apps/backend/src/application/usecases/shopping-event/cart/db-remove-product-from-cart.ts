import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../../contracts';
import {
  ProductNotFoundError,
  type RemoveProductFromCart,
  type RemoveProductFromCartParams,
} from '@/domain';
import {
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

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
  }: RemoveProductFromCartParams): Promise<void> => {
    try {
      // Get shoppingEvent by ID
      const shoppingEvent = await this.repository.getById({
        familyId,
        shoppingEventId,
      });

      // Return ShoppingEventNotFoundError if shoppingEvent is undefined
      if (!shoppingEvent) {
        throw new ShoppingEventNotFoundException();
      }

      if (shoppingEvent.status !== 'ONGOING') {
        throw new ShoppingEventAlreadyEndedException();
      }

      // Retrieve Product from shoppingEvent
      const product = shoppingEvent.products.getItemById(productId);

      // Return ProductNotFoundError if no product is found
      if (!product) {
        throw new ProductNotFoundError();
      }

      // remove the product from the list
      shoppingEvent.removeProduct(product);

      // Update shoppingEvent (removing the produt) to the database
      await this.repository.update(shoppingEvent);

      // Return right void
      return;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
