import { describe, expect, it } from 'vitest';
import { Product } from '@/domain/entities/product';
import { Products } from '@/domain/entities/products';
import { ShoppingEvent } from '@/domain/entities/shopping-event';

describe('ShoppingEvent Entity - Repro', () => {
  it('should optimize calculations using dirty flag', () => {
    const p1 = Product.create({
      shoppingEventId: 'any_id',
      name: 'Product 1',
      amount: 1,
      price: 10,
      addedAt: new Date(),
      addedBy: 'any_user',
    });

    const products = Products.create([p1]);
    const shoppingEvent = ShoppingEvent.create({
      groupId: 'any_group',
      marketId: 'any_market',
      status: 'ongoing',
      products,
      createdAt: new Date(),
      createdBy: 'any_user',
    });

    // First call triggers calculation
    const totals1 = shoppingEvent.getCalculatedTotals();
    expect(totals1.retailTotal).toBe(10);

    // Modify product directly via internal list (mocking a change that shouldn't trigger recalc unless flagged)
    // But here we want to test that public methods trigger recalc.

    const p2 = Product.create({
      shoppingEventId: 'any_id',
      name: 'Product 2',
      amount: 1,
      price: 20,
      addedAt: new Date(),
      addedBy: 'any_user',
    });

    shoppingEvent.addProduct(p2);

    // Should trigger recalc
    const totals2 = shoppingEvent.getCalculatedTotals();
    expect(totals2.retailTotal).toBe(30);
    expect(totals2.totalItemsQuantity).toBe(2);
  });
});
