import { inject, injectable } from 'tsyringe';
import type {
  AddCanonicalProductRepository,
  AddProductIdentityRepository,
  ExternalProductClient,
  GetProductIdentityByValueRepository,
  OutboxEventRepositories,
  ShoppingEventRepositories,
} from '@/application/contracts';
import type { PhysicalEanRepository } from '@/application/contracts/repositories/product-hierarchy';
import type { ProductIdentityRepository } from '@/application/contracts/repositories/product-identity-repository';
import type {
  ICartService,
  ManualSearchResponse,
  ScanProductRequest,
  ScanProductResponse,
} from '@/domain';
import {
  CanonicalProduct,
  OutboxEvent,
  type Product,
  ProductIdentity,
} from '@/domain';
import type { RequesterContext } from '@/domain/core/requester-context';
import {
  ProductNotFoundException,
  ShoppingEventAlreadyEndedException,
  ShoppingEventNotFoundException,
} from '@/domain/exceptions';
import { VariableWeightParser } from '@/domain/products/variable-weight-parser';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(infra.shoppingEventRepositories)
    private readonly shoppingEventRepository: ShoppingEventRepositories,
    @inject(infra.canonicalProductRepositories)
    private readonly canonicalProductRepository: AddCanonicalProductRepository,
    @inject(infra.productIdentityRepositories)
    private readonly productIdentityRepository: AddProductIdentityRepository &
      GetProductIdentityByValueRepository &
      ProductIdentityRepository,
    @inject(infra.outboxEventRepositories)
    private readonly outboxRepository: OutboxEventRepositories,
    @inject(infra.physicalEanRepository)
    private readonly physicalEanRepository: PhysicalEanRepository,
    @inject(infra.compositeProductClient)
    private readonly externalClient: ExternalProductClient,
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

    // Outbox event to hydrate asynchronously
    const outboxEvent = OutboxEvent.create({
      type: 'ProductScanned',
      payload: { canonicalProductId: cp.id, barcode },
    });
    await this.outboxRepository.add(outboxEvent);

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

  async manualSearch(
    ctx: RequesterContext,
    { query }: { query: string },
  ): Promise<ManualSearchResponse> {
    await ctx.checkPermission('create', 'shoppingEvent');

    const result = await this.productIdentityRepository.search(query, 0, 10);

    return {
      products: result.items.map((identity) => ({
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
    let weightValue: number | undefined;

    // 0. Variable Weight Check
    if (VariableWeightParser.isVariableWeight(barcode)) {
      const parsed = VariableWeightParser.parse(barcode);
      barcode = parsed.baseEan;
      weightValue = parsed.value;
    }

    // 1. Local Database Match (PhysicalEAN)
    const physicalEan = await this.physicalEanRepository.findByBarcode(barcode);
    if (physicalEan) {
      const identity = await this.productIdentityRepository.getById(
        physicalEan.productIdentityId,
      );
      if (identity) {
        return {
          product: {
            id: identity.id,
            name: identity.name || 'Unknown',
            brand: identity.brand,
            imageUrl: identity.imageUrl,
          },
          matchType: 'INTERNAL',
        };
      }
    }

    // 2. Check for direct ProductIdentity match (legacy or non-physical EAN)
    const directIdentity = await this.productIdentityRepository.getByValue(
      'EAN',
      barcode,
    );
    if (directIdentity) {
      return {
        product: {
          id: directIdentity.id,
          name: directIdentity.name || 'Unknown',
          brand: directIdentity.brand,
          imageUrl: directIdentity.imageUrl,
          price: weightValue, // Incorporate the parsed value if it's a variable weight item
        },
        matchType: 'INTERNAL',
      };
    }

    // 3. External Fallback
    const externalMatch = await this.externalClient.fetchByBarcode(barcode);
    if (externalMatch) {
      // Fire outbox event for background hydration
      await this.outboxRepository.add(
        OutboxEvent.create({
          type: 'ProductScanned',
          payload: { barcode, source: externalMatch.source },
        }),
      );

      return {
        product: {
          id: `TEMP_${barcode}`, // Temporary ID for frontend, hydration happens in background
          name: externalMatch.name,
          brand: externalMatch.brand,
          imageUrl: externalMatch.imageUrl,
        },
        matchType: 'EXTERNAL',
      };
    }

    return {
      product: null,
      matchType: 'NONE',
    };
  }
}
