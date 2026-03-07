import { inject, injectable } from 'tsyringe';
import type {
  AddCanonicalProductRepository,
  AddProductIdentityRepository,
  GetProductIdentityByValueRepository,
  ShoppingEventRepositories,
} from '@/application/contracts';
import { CanonicalProduct, type Product, ProductIdentity } from '@/domain';
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
    @inject(infra.canonicalProductRepositories)
    private readonly canonicalProductRepository: AddCanonicalProductRepository,
    @inject(infra.productIdentityRepositories)
    private readonly productIdentityRepository: AddProductIdentityRepository &
      GetProductIdentityByValueRepository,
  ) {}

  async addProductToCart(
    ctx: RequesterContext,
    {
      shoppingEventId,
      name,
      barcode,
      amount,
      price,
      wholesaleMinAmount,
      wholesalePrice,
    }: {
      shoppingEventId: string;
      name: string;
      barcode?: string;
      amount: number;
      price: number;
      wholesaleMinAmount?: number;
      wholesalePrice?: number;
    },
  ): Promise<Product> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      shoppingEventId,
      groupId: ctx.group.id,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    const canonicalProductId = await this.resolveCanonicalProduct(
      name,
      barcode,
    );

    const product = shoppingEvent.upsertProduct(undefined, {
      canonicalProductId,
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

  private async resolveCanonicalProduct(
    name: string,
    barcode?: string,
  ): Promise<string> {
    if (barcode) {
      return this.handleBarcodeEntry(name, barcode);
    }

    return this.handleManualEntry(name);
  }

  private async handleBarcodeEntry(
    name: string,
    barcode: string,
  ): Promise<string> {
    const identity = await this.productIdentityRepository.getByValue(
      'EAN',
      barcode,
    );

    if (identity) {
      return identity.canonicalProductId;
    }

    // "Pending Hydration" strategy: Create canonical product on the fly
    const cp = CanonicalProduct.create({
      name,
      description: 'Pending enrichment',
    });
    await this.canonicalProductRepository.add(cp);

    const pi = ProductIdentity.create({
      canonicalProductId: cp.id,
      type: 'EAN',
      value: barcode,
    });
    await this.productIdentityRepository.add(pi);

    return cp.id;
  }

  private async handleManualEntry(name: string): Promise<string> {
    // Manual entry: Create a "Global" entry for this name if it doesn't exist
    const cp = CanonicalProduct.create({
      name,
      description: 'Manual entry',
    });
    await this.canonicalProductRepository.add(cp);
    return cp.id;
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
    await ctx.checkPermission('create', 'shoppingEvent');

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
      canonicalProductId: existing.canonicalProductId,
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
    await ctx.checkPermission('create', 'shoppingEvent');

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
