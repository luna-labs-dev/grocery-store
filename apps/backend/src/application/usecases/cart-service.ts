import { inject, injectable } from 'tsyringe';
import type { ShoppingEventRepositories } from '@/application/contracts';
import type {
  ICartService,
  ManualSearchResponse,
  Product,
  ScanProductRequest,
  ScanProductResponse,
} from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import type {
  IHydrateProductUseCase,
  IManualSearchUseCase,
  IScanProductUseCase,
} from '@/domain/usecases';
import { injection } from '@/main/di/injection-tokens';

const { infra, usecases } = injection;

@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
    @inject(usecases.hydrateProductUseCase)
    private readonly hydrateProductUseCase: IHydrateProductUseCase,
    @inject(usecases.manualSearchUseCase)
    private readonly manualSearchUseCase: IManualSearchUseCase,
    @inject(usecases.scanProductUseCase)
    private readonly scanProductUseCase: IScanProductUseCase,
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
      return this.hydrateProductUseCase.register(name, barcode);
    }

    return this.handleManualEntry(name);
  }

  private async handleManualEntry(name: string): Promise<string> {
    return this.hydrateProductUseCase.register(name, '');
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

  async manualSearch(
    ctx: RequesterContext,
    { query }: { query: string },
  ): Promise<ManualSearchResponse> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const result = await this.manualSearchUseCase.execute(query, 0, 10);

    return {
      items: result.items.map((identity) => ({
        id: identity.id,
        name: identity.name || 'Unknown',
        brand: identity.brand,
        imageUrl: identity.imageUrl,
      })),
    };
  }

  async scanProduct({
    barcode,
  }: ScanProductRequest): Promise<ScanProductResponse> {
    const result = await this.scanProductUseCase.execute(barcode);

    if (result.matchType === 'NOT_FOUND') {
      return {
        barcode,
        matchType: 'NOT_FOUND',
      };
    }

    return {
      barcode,
      matchType: result.matchType,
      product: result.product
        ? {
            id: result.product.id || `TEMP_${barcode}`,
            name: result.product.name,
            brand: result.product.brand,
            imageUrl: result.product.imageUrl,
            canonicalProductId: result.product.id || `TEMP_${barcode}`,
          }
        : undefined,
      variableWeight: result.variableWeight
        ? {
            productCode: barcode,
            weight: result.variableWeight.weightInGrams || 0,
            price: result.variableWeight.totalPrice || 0,
          }
        : undefined,
    };
  }
}
