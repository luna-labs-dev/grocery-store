import { inject, injectable } from 'tsyringe';
import type {
  ExternalProductClient,
  ExternalProductResult,
} from '../../../../application/contracts/services/external-product-client';
import { injection } from '../../../../main/di/injection-tokens';

@injectable()
export class CompositeExternalProductClient implements ExternalProductClient {
  constructor(
    @inject(injection.infra.openFoodFactsClient)
    private offClient: ExternalProductClient,
    @inject(injection.infra.upcItemDbClient)
    private upcClient: ExternalProductClient,
  ) {}

  async fetchByBarcode(barcode: string): Promise<ExternalProductResult | null> {
    // Priority 1: Open Food Facts
    try {
      const offResult = await this.offClient.fetchByBarcode(barcode);
      if (offResult) return offResult;
    } catch (error) {
      console.error('OFF lookup failed:', error);
    }

    // Priority 2: UPCitemdb
    try {
      const upcResult = await this.upcClient.fetchByBarcode(barcode);
      if (upcResult) return upcResult;
    } catch (error) {
      console.error('UPCitemdb lookup failed:', error);
    }

    return null;
  }
}
