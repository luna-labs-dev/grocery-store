import { inject, injectable } from 'tsyringe';
import type { ShoppingEventRepositories } from '@/application/contracts';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import { VariableWeightParser } from '@/domain/core/logic/variable-weight-parser';
import type { RequesterContext } from '@/domain/core/requester-context';
import type { Product } from '@/domain/entities';
import type { OutboxEvent } from '@/domain/entities/outbox-event';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import type {
  ICartManager,
  ManualSearchRequest,
  ManualSearchResponse,
  ScanProductRequest,
  ScanProductResult,
} from '@/domain/usecases/cart-manager';
import type { IProductHydrator } from '@/domain/usecases/product-hydrator';
import { injection } from '@/main/di/injection-tokens';

const { infra, usecases } = injection;

@injectable()
export class DbCartManager implements ICartManager {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
    @inject(usecases.productHydrator)
    private readonly productHydrator: IProductHydrator,
    @inject(infra.productIdentityRepositories)
    private readonly productIdentityRepo: ProductIdentityRepository,
    @inject(infra.compositeProductService)
    private readonly externalService: ExternalProductClient,
    @inject(infra.outboxEventRepositories)
    private readonly outboxRepo: OutboxEventRepositories,
  ) {}

  async addProductToCart(
    ctx: RequesterContext,
    params: {
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
      shoppingEventId: params.shoppingEventId,
      groupId: ctx.group.id,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    const canonicalProductId = await this.resolveCanonicalProduct(
      params.name,
      params.barcode,
    );

    const product = shoppingEvent.upsertProduct(undefined, {
      canonicalProductId,
      name: params.name,
      amount: params.amount,
      price: params.price,
      wholesaleMinAmount: params.wholesaleMinAmount,
      wholesalePrice: params.wholesalePrice,
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
      return this.productHydrator.register(name, barcode);
    }

    return this.handleManualEntry(name);
  }

  private async handleManualEntry(name: string): Promise<string> {
    return this.productHydrator.register(name, '');
  }

  async updateProductInCart(
    ctx: RequesterContext,
    params: {
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
      shoppingEventId: params.shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    // Ensure product exists
    const existing = shoppingEvent.products.getItemById(params.productId);
    if (!existing) throw new ProductNotFoundException();

    const product = shoppingEvent.upsertProduct(params.productId, {
      canonicalProductId: existing.canonicalProductId,
      name: params.name ?? existing.name,
      amount: params.amount ?? existing.amount,
      price: params.price ?? existing.price,
      wholesaleMinAmount:
        params.wholesaleMinAmount ?? existing.wholesaleMinAmount,
      wholesalePrice: params.wholesalePrice ?? existing.wholesalePrice,
      addedBy: existing.addedBy,
      addedAt: existing.addedAt,
    });

    await this.shoppingEventRepository.update(shoppingEvent);

    return product;
  }

  async removeProductFromCart(
    ctx: RequesterContext,
    params: {
      shoppingEventId: string;
      productId: string;
    },
  ): Promise<void> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const shoppingEvent = await this.shoppingEventRepository.getById({
      groupId: ctx.group.id,
      shoppingEventId: params.shoppingEventId,
    });

    if (!shoppingEvent) throw new ShoppingEventNotFoundException();
    if (shoppingEvent.status !== 'ongoing')
      throw new ShoppingEventAlreadyEndedException();

    shoppingEvent.removeProductById(params.productId);

    await this.shoppingEventRepository.update(shoppingEvent);
  }

  async manualSearch(
    ctx: RequesterContext,
    params: ManualSearchRequest,
  ): Promise<ManualSearchResponse> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const query = params.query;
    if (!query || query.trim().length < 2) {
      return { items: [], total: 0 };
    }

    const result = await this.productIdentityRepo.search(
      query,
      params.pageIndex ?? 0,
      params.pageSize ?? 10,
    );

    return result as ManualSearchResponse;
  }

  async scanProduct(params: ScanProductRequest): Promise<ScanProductResult> {
    const { barcode } = params;
    // 1. Check Variable Weight (Prefix 2)
    const vwResult = VariableWeightParser.parse(barcode);

    if (vwResult) {
      return {
        barcode,
        matchType: 'VARIABLE_WEIGHT',
        variableWeight: {
          productCode: vwResult.productCode,
          weight: vwResult.weightInGrams
            ? vwResult.weightInGrams / 1000
            : undefined,
          price: vwResult.totalPrice,
        },
        requiresPriceConfirmation: true,
        source: 'variable-weight',
      };
    }

    // 2. Check Local Database (Consolidated Identity)
    const identity = await this.productIdentityRepo.getByValue('EAN', barcode);
    if (identity) {
      return {
        barcode,
        matchType: 'LOCAL',
        product: {
          id: identity.id,
          name: identity.name ?? 'Produto sem nome',
          brand: identity.brand || undefined,
          imageUrl: identity.imageUrl || undefined,
        },
        requiresPriceConfirmation: true,
        source: 'local',
      };
    }

    // 3. External Fallback
    const externalResult = await this.externalService.fetchByBarcode(barcode);
    if (externalResult) {
      await this.outboxRepo.add({
        type: 'ProductScanned',
        payload: { barcode, source: externalResult.source },
      } as OutboxEvent);

      return {
        barcode,
        matchType: 'EXTERNAL',
        product: {
          name: externalResult.name,
          brand: externalResult.brand,
          imageUrl: externalResult.imageUrl,
        },
        requiresPriceConfirmation: true,
        source: 'external',
      };
    }

    return {
      barcode,
      matchType: 'NOT_FOUND',
      requiresPriceConfirmation: false,
      source: 'none',
    };
  }
}
