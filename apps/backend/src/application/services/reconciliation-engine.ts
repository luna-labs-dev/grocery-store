import { injectable } from 'tsyringe';
import type { DecodedNfcE } from './nfc-e-decoder-service';
import type { ShoppingEvent } from '@/domain';

export interface PriceDelta {
  ean: string;
  productName: string;
  expectedPrice: number; // Price reported in app during shopping
  actualPrice: number; // Price found on fiscal ticket
  delta: number;
}

@injectable()
export class ReconciliationEngine {
  reconcile(_shoppingEvent: ShoppingEvent, ticket: DecodedNfcE): PriceDelta[] {
    const deltas: PriceDelta[] = [];

    for (const _item of ticket.items) {
      // Match items by EAN/Name and find discrepancies
      // Placeholder logic
    }

    return deltas;
  }
}
