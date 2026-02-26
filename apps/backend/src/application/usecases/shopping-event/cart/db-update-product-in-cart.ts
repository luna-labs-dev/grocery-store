import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../../contracts';
import {
  Product,
  type UpdateProductInCart,
  type UpdateProductInCartParams,
} from '@/domain';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

type UpdateProductInCartRepositories = GetShoppingEventByIdRepository &
  UpdateShoppingEventRepository;

const { infra } = injection;
@injectable()
export class DbUpdateProductInCart implements UpdateProductInCart {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly repository: UpdateProductInCartRepositories,
  ) {}

  execute = async ({
    familyId,
    shoppingEventId,
    productId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: UpdateProductInCartParams): Promise<Product> => {
    try {
      // Fetch shoppingEvent
      const shoppingEvent = await this.repository.getById({
        familyId,
        shoppingEventId,
      });

      // Return shoppingEventNotFoundError if shoppingEvent is undefined
      if (!shoppingEvent) {
        throw new ShoppingEventNotFoundException();
      }

      if (shoppingEvent.status !== 'ONGOING') {
        throw new ShoppingEventAlreadyEndedException();
      }

      // Return productNotFoundError if product not in list
      const currentProduct = shoppingEvent.products.getItemById(productId);

      if (!currentProduct) {
        throw new ProductNotFoundException();
      }

      // Update product with new values
      const product = Product.create(
        { ...currentProduct.props },
        currentProduct.id,
      );

      product.update({
        name,
        amount,
        price,
        wholesaleMinAmount,
        wholesalePrice,
      });

      shoppingEvent.products.add(product);

      // Update shoppingEvent in database
      await this.repository.update(shoppingEvent);

      // return product object
      return product;
    } catch (error) {
      console.error(error);

      throw new UnexpectedException();
    }
  };
}
