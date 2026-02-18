import { inject, injectable } from 'tsyringe';
import type {
  GetShoppingEventByIdRepository,
  UpdateShoppingEventRepository,
} from '../../../contracts';
import {
  type Either,
  left,
  Product,
  ProductNotFoundError,
  right,
  ShoppingEventAlreadyEndedError,
  ShoppingEventNotFoundError,
  UnexpectedError,
  type UpdateProductInCart,
  type UpdateProductInCartErrors,
  type UpdateProductInCartParams,
} from '@/domain';
import { injection } from '@/main/di/injection-codes';

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
  }: UpdateProductInCartParams): Promise<
    Either<UpdateProductInCartErrors, Product>
  > => {
    try {
      // Fetch shoppingEvent
      const shoppingEvent = await this.repository.getById({
        familyId,
        shoppingEventId,
      });

      // Return shoppingEventNotFoundError if shoppingEvent is undefined
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

      // Return productNotFoundError if product not in list
      const currentProduct = shoppingEvent.products.getItemById(productId);

      if (!currentProduct) {
        return left(new ProductNotFoundError());
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
      return right(product);
    } catch (error) {
      console.error(error);

      return left(new UnexpectedError());
    }
  };
}
