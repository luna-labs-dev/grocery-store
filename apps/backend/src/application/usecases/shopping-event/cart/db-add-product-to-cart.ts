import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '@/application';
import {
  type AddProductToCart,
  type AddProductToCartParams,
  Product,
} from '@/domain';
import {
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

type ShoppingEventRepositories = GetShoppingEventByIdRepository &
  UpdateShoppingEventRepository;

const { infra } = injection;

@injectable()
export class DbAddProductToCart implements AddProductToCart {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
  ) {}

  execute = async ({
    userId,
    familyId,
    shoppingEventId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: AddProductToCartParams): Promise<Product> => {
    try {
      // Fetch ShoppingEvent
      const shoppingEvent = await this.shoppingEventRepository.getById({
        shoppingEventId,
        familyId,
      });

      // Returns ShoppingEventNotFoundError fetch returns undefined
      if (!shoppingEvent) {
        throw new ShoppingEventNotFoundException();
      }

      if (shoppingEvent.status !== 'ONGOING') {
        throw new ShoppingEventAlreadyEndedException();
      }

      // Created the Product Entity
      const product = Product.create({
        shoppingEventId,
        name,
        amount,
        price,
        wholesaleMinAmount,
        wholesalePrice,
        addedAt: new Date(),
        addedBy: userId,
      });

      // Push the product to the shoppingEvent product list
      shoppingEvent.addProduct(product);

      // Update shoppingEvent
      await this.shoppingEventRepository.update(shoppingEvent);

      // Returns the recently created product
      return product;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
