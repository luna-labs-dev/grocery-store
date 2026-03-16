import { inject, injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductMatch,
} from '@/application/contracts/external-product-client';
import { injection } from '@/main/di/injection-tokens';

const { infra } = injection;

@injectable()
export class CompositeExternalProductClient implements ExternalProductClient {
  constructor(
    @inject(infra.openFoodFactsClient)
    private readonly primaryClient: ExternalProductClient,
    @inject(infra.upcItemDbClient)
    private readonly fallbackClient: ExternalProductClient,
  ) {}

  async fetchByBarcode(barcode: string): Promise<ExternalProductMatch | null> {
    const primaryResult = await this.primaryClient.fetchByBarcode(barcode);
    if (primaryResult) {
      return primaryResult;
    }

    const fallbackResult = await this.fallbackClient.fetchByBarcode(barcode);
    return fallbackResult;
  }
}
