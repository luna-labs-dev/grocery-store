import { inject, injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductMatch,
} from '@/application/contracts/external-product-client';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class CompositeExternalProductService implements ExternalProductClient {
  constructor(
    @inject(infra.openFoodFactsService)
    private readonly primaryClient: ExternalProductClient,
    @inject(infra.upcItemDbService)
    private readonly fallbackClient: ExternalProductClient,
  ) {}

  async fetchByBarcode(
    barcode: string,
  ): Promise<ExternalProductMatch | undefined> {
    const primaryResult = await this.primaryClient.fetchByBarcode(barcode);
    if (primaryResult) {
      return primaryResult;
    }

    const fallbackResult = await this.fallbackClient.fetchByBarcode(barcode);
    return fallbackResult;
  }
}
