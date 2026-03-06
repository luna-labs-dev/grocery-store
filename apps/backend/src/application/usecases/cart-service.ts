import { inject, injectable } from 'tsyringe';
import type { ShoppingEventRepositories } from '@/application/contracts';
import type { Product } from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class CartService {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
  ) {}

  async addProductToCart(
    ctx: RequesterContext,
    {
      shoppingEventId,
      name,
      amount,
      price,
      wholesaleMinAmount,
      wholesalePrice,
    }: {
      shoppingEventId: string;
      name: string;
      amount: number;
      price: number;
      wholesaleMinAmount?: number;
      wholesalePrice?: number;
    },
  ): Promise<Product> {
    ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId: ctx.group.id,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    const product = shoppingEvent.upsertProduct(undefined, {
      name,
      amount,
      price,
      wholesaleMinAmount,
      wholesalePrice,
      addedBy: ctx.user.id,
      addedAt: new Date(),
    });

    await this.shoppingEventRepository.update(shoppingEvent);

    return product;
  }

  async updateProductInCart(
    ctx: RequesterContext,
    {
      shoppingEventId,
      productId,
      name,
      amount,
      price,
      wholesaleMinAmount,
      wholesalePrice,
    }: {
      shoppingEventId: string;
      productId: string;
      name?: string;
      amount?: number;
      price?: number;
      wholesaleMinAmount?: number;
      wholesalePrice?: number;
    },
  ): Promise<Product> {
    ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      groupId: ctx.group.id,
      shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    // Ensure product exists
    const existing = shoppingEvent.products.getItemById(productId);
    if (!existing) throw new ProductNotFoundException();

    const product = shoppingEvent.upsertProduct(productId, {
      name: name ?? existing.name,
      amount: amount ?? existing.amount,
      price: price ?? existing.price,
      wholesaleMinAmount: wholesaleMinAmount ?? existing.wholesaleMinAmount,
      wholesalePrice: wholesalePrice ?? existing.wholesalePrice,
      addedBy: existing.addedBy,
      addedAt: existing.addedAt,
    });

    await this.shoppingEventRepository.update(shoppingEvent);

    return product;
  }

  async removeProductFromCart(
    ctx: RequesterContext,
    {
      shoppingEventId,
      productId,
    }: {
      shoppingEventId: string;
      productId: string;
    },
  ): Promise<void> {
    ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      groupId: ctx.group.id,
      shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    shoppingEvent.removeProductById(productId);

    await this.shoppingEventRepository.update(shoppingEvent);
  }
}
