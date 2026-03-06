import { inject, injectable } from 'tsyringe';
import type {
  GetMarketByIdRepository,
  ShoppingEventRepositories,
  UserRepositories,
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
import { hasGroupPermission } from '@/domain/core/logic/permissions';
import { Products } from '@/domain/entities/products';
import {
  MarketNotFoundException,
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventEmptyCartException,
  ShoppingEventNotFoundException,
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
    @inject(infra.userRepositories)
    private readonly userRepository: UserRepositories,
  ) {}

  async startShoppingEvent({
    userId,
    groupId,
    marketId,
  }: StartShoppingEventParams): Promise<ShoppingEvent> {
    const market = await this.marketRepository.getById({ id: marketId });
    if (!market) throw new MarketNotFoundException();

    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'create', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException(); // using a generic/unauthorized type error if possible, or Unexpected
    }

    const shoppingEvent = ShoppingEvent.create({
      groupId,
      marketId,
      market,
      status: 'ongoing',
      createdAt: new Date(),
      createdBy: userId,
      products: Products.create([]),
    });

    await this.shoppingEventRepository.add(shoppingEvent);

    return shoppingEvent;
  }

  async endShoppingEvent({
    shoppingEventId,
    groupId,
    totalPaid,
    userId,
  }: EndShoppingEventParams): Promise<ShoppingEvent> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'create', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();
    if (shoppingEvent.products.getItems().length <= 0)
      throw new ShoppingEventEmptyCartException();

    shoppingEvent.end(totalPaid);

    await this.shoppingEventRepository.update(shoppingEvent);

    return shoppingEvent;
  }

  async getShoppingEventList({
    groupId,
    status,
    period,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
    userId,
  }: GetShoppingEventListParams): Promise<GetShoppingEventListResult> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'read', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const total = await this.shoppingEventRepository.count({
      groupId,
      status,
      period,
    });

    const response: GetShoppingEventListResult = {
      total,
      shoppingEvents: [],
    };

    if (total > 0) {
      response.shoppingEvents = await this.shoppingEventRepository.getAll({
        groupId,
        status,
        period,
        pageIndex,
        pageSize,
        orderBy,
        orderDirection,
      });
    }

    return response;
  }

  async getShoppingEventById({
    groupId,
    shoppingEventId,
    userId,
  }: GetShoppingEventByIdParams): Promise<ShoppingEvent> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'read', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();

    return shoppingEvent;
  }

  async addProductToCart({
    userId,
    groupId,
    shoppingEventId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: AddProductToCartParams): Promise<Product> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'create', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
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
  }

  async updateProductInCart({
    groupId,
    shoppingEventId,
    productId,
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
    userId,
  }: UpdateProductInCartParams): Promise<Product> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'create', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const shoppingEvent = await this.shoppingEventRepository.getById({
      groupId,
      shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
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
  }

  async removeProductFromCart({
    groupId,
    shoppingEventId,
    productId,
    userId,
  }: RemoveProductFromCartParams): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (
      !user ||
      !hasGroupPermission(user, 'create', 'shoppingEvent', {
        groupId,
      })
    ) {
      throw new ShoppingEventNotFoundException();
    }

    const shoppingEvent = await this.shoppingEventRepository.getById({
      groupId,
      shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    const product = shoppingEvent.products.getItemById(productId);

    if (!product) throw new ProductNotFoundException();

    shoppingEvent.removeProduct(product);

    await this.shoppingEventRepository.update(shoppingEvent);
  }
}
