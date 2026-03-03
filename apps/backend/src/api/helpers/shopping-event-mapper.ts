import { marketMapper } from './market-mapper';
import type { ShoppingEventSummaryDto } from './shopping-event-schemas';
import type { ShoppingEvent } from '@/domain';

export const shoppingEventMapper = {
  toSummaryDto(shoppingEvent: ShoppingEvent): ShoppingEventSummaryDto {
    return {
      id: shoppingEvent.id,
      status: shoppingEvent.status,
      market: shoppingEvent.market
        ? marketMapper.toResponse(shoppingEvent.market)
        : (undefined as any), // Fallback should be handled by the schema/controller if possible
      totals: shoppingEvent.getCalculatedTotals(),
      products: shoppingEvent.products.getItems().map((prod) => {
        const { totalsRetailOnly, totalsWithWhosale, totalsDifference } =
          prod.getCalculatedTotals();
        return {
          id: prod.id,
          name: prod.name,
          amount: prod.amount,
          price: prod.price,
          wholesaleMinAmount: prod.wholesaleMinAmount,
          wholesalePrice: prod.wholesalePrice,
          totalRetailPrice: totalsRetailOnly,
          totalWholesalePrice: totalsWithWhosale,
          totalDifference: totalsDifference,
          addedAt: prod.addedAt,
        };
      }),
      elapsedTime: shoppingEvent.elapsedTime,
      createdAt: shoppingEvent.createdAt,
      finishedAt: shoppingEvent.finishedAt,
      createdBy: shoppingEvent.createdBy,
    };
  },
};
