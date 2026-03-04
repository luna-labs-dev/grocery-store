import { inject, injectable } from 'tsyringe';
import type {
  GetMarketByIdRepository,
  ShoppingEventRepositories,
} from '@/application/contracts';
import type {
  AddProductToCartParams,
  EndShoppingEventParams,
  GetShoppingEventByIdParams,
  GetShoppingEventListParams,
  GetShoppingEventListResult,
  RemoveProductFromCartParams,
  StartShoppingEventParams,
  UpdateProductInCartParams,
} from '@/domain';
import { Product, ShoppingEvent } from '@/domain';
import { Products } from '@/domain/entities/products';
import {
  MarketNotFoundException,
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
  UnexpectedException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class ShoppingEventService {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
    @inject(infra.marketRepositories)
    private readonly marketRepository: GetMarketByIdRepository,
  ) {}

  async startShoppingEvent({
    userId,
    familyId,
    marketId,
  }: StartShoppingEventParams): Promise<ShoppingEvent> {
    try {
      const market = await this.marketRepository.getById({ id: marketId });

      if (!market) throw new MarketNotFoundException();

      const shoppingEvent = ShoppingEvent.create({
        familyId,
        marketId,
        market,
        status: 'ONGOING',
        createdAt: new Date(),
        createdBy: userId,
        products: Products.create([]),
      });

      await this.shoppingEventRepository.add(shoppingEvent);

      return shoppingEvent;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async endShoppingEvent({
    shoppingEventId,
    familyId,
    totalPaid,
  }: EndShoppingEventParams): Promise<ShoppingEvent> {
    try {
      const shoppingEvent = await this.shoppingEventRepository.getById({
        shoppingEventId,
        familyId,
      });

      if (!shoppingEvent) throw new ShoppingEventNotFoundException();
      if (shoppingEvent.status !== 'ONGOING')
        throw new ShoppingEventAlreadyEndedException();
      if (shoppingEvent.products.getItems().length <= 0)
        throw new ShoppingEventEmptyCartException();

      shoppingEvent.end(totalPaid);

      await this.shoppingEventRepository.update(shoppingEvent);

      return shoppingEvent;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getShoppingEventList({
    familyId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
  }: GetShoppingEventListParams): Promise<GetShoppingEventListResult> {
    try {
      const total = await this.shoppingEventRepository.count({
        familyId,
        status,
        period,
      });

      const response: GetShoppingEventListResult = {
        total,
        shoppingEvents: [],
      };

      if (total > 0) {
        response.shoppingEvents = await this.shoppingEventRepository.getAll({
          familyId,
          status,
          period,
          pageIndex,
          pageSize,
          orderBy,
          orderDirection,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async getShoppingEventById({
    familyId,
    shoppingEventId,
  }: GetShoppingEventByIdParams): Promise<ShoppingEvent> {
    try {
      const shoppingEvent = await this.shoppingEventRepository.getById({
        shoppingEventId,
        familyId,
      });

      if (!shoppingEvent) throw new ShoppingEventNotFoundException();

      return shoppingEvent;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async addProductToCart({
    userId,
    familyId,
    shoppingEventId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: AddProductToCartParams): Promise<Product> {
    try {
      const shoppingEvent = await this.shoppingEventRepository.getById({
        shoppingEventId,
        familyId,
      });

      if (!shoppingEvent) throw new ShoppingEventNotFoundException();
      if (shoppingEvent.status !== 'ONGOING')
        throw new ShoppingEventAlreadyEndedException();

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

      shoppingEvent.addProduct(product);

      await this.shoppingEventRepository.update(shoppingEvent);

      return product;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async updateProductInCart({
    familyId,
    shoppingEventId,
    productId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: UpdateProductInCartParams): Promise<Product> {
    try {
      const shoppingEvent = await this.shoppingEventRepository.getById({
        familyId,
        shoppingEventId,
      });

      if (!shoppingEvent) throw new ShoppingEventNotFoundException();
      if (shoppingEvent.status !== 'ONGOING')
        throw new ShoppingEventAlreadyEndedException();

      const currentProduct = shoppingEvent.products.getItemById(productId);

      if (!currentProduct) throw new ProductNotFoundException();

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

      await this.shoppingEventRepository.update(shoppingEvent);

      return product;
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }

  async removeProductFromCart({
    familyId,
    shoppingEventId,
    productId,
  }: RemoveProductFromCartParams): Promise<void> {
    try {
      const shoppingEvent = await this.shoppingEventRepository.getById({
        familyId,
        shoppingEventId,
      });

      if (!shoppingEvent) throw new ShoppingEventNotFoundException();
      if (shoppingEvent.status !== 'ONGOING')
        throw new ShoppingEventAlreadyEndedException();

      const product = shoppingEvent.products.getItemById(productId);

      if (!product) throw new ProductNotFoundException();

      shoppingEvent.removeProduct(product);

      await this.shoppingEventRepository.update(shoppingEvent);
    } catch (error) {
      console.error(error);
      throw new UnexpectedException();
    }
  }
}
