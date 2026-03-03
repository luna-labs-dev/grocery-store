import type { ShoppingEventSummaryDto } from './shopping-event-schemas';
import type { ShoppingEvent } from '@/domain';

export const shoppingEventMapper = {
  toSummaryDto(shoppingEvent: ShoppingEvent): ShoppingEventSummaryDto {
    return {
      id: shoppingEvent.id,
      status: shoppingEvent.status,
      market: shoppingEvent.market
        ? shoppingEvent.market.toDto()
        : { id: shoppingEvent.marketId },
      totals: shoppingEvent.getCalculatedTotals(),
      products: shoppingEvent.products.getItems().map((prod) => {
        const { totalsRetailOnly, totalsWithWhosale, totalsDifference } =
          prod.getCalculatedTotals();
        return {
          id: prod.id,
          name: prod.name,
          amount: prod.amount,
          wholesaleMinAmount: prod.wholesaleMinAmount,
          price: prod.price,
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
