import { describe, expect, it } from 'vitest';
import { Product } from './product';
import { Products } from './products';
import { ShoppingEvent } from './shopping-event';

describe('ShoppingEvent Entity', () => {
  it('should calculate new metrics correctly in a single iteration', () => {
    const p1 = Product.create({
      shoppingEventId: 'any_id',
      name: 'Product 1',
      amount: 2,
      price: 10,
      addedAt: new Date(),
      addedBy: 'any_user',
    });

    const p2 = Product.create({
      shoppingEventId: 'any_id',
      name: 'Product 2',
      amount: 1,
      price: 25,
      wholesaleMinAmount: 1,
      wholesalePrice: 20,
      addedAt: new Date(),
      addedBy: 'any_user',
    });

    const products = Products.create([p1, p2]);
    const shoppingEvent = ShoppingEvent.create({
      familyId: 'any_family',
      marketId: 'any_market',
      status: 'ONGOING',
      products,
      createdAt: new Date(),
      createdBy: 'any_user',
    });

    const totals = shoppingEvent.getCalculatedTotals();

    // Retail Total: (2 * 10) + (1 * 25) = 45
    // Wholesale Total: (2 * 10) + (1 * 20) = 40 (fallback to retail for p1, wholesale for p2)
    // Total Items Distinct: 2
    // Total Items Quantity: 3
    // Highest Price: 25
    // Lowest Price: 10
    // Savings Percentage: ((45 - 40) / 45) * 100 = 11.11...
    // Average Price Per Unit: (Wholesale fallback because totalPaid is undefined) 40 / 3 = 13.33...

    expect(totals.retailTotal).toBe(45);
    expect(totals.wholesaleTotal).toBe(40);
    expect(totals.totalItemsDistinct).toBe(2);
    expect(totals.totalItemsQuantity).toBe(3);
    expect(totals.highestPrice).toBe(25);
    expect(totals.lowestPrice).toBe(10);
    expect(totals.savingsPercentage).toBeCloseTo(11.11, 2);
    expect(totals.savingsValue).toBe(5);
    expect(totals.averagePricePerUnit).toBeCloseTo(13.33, 2);
  });

  it('should return correct summary DTO', () => {
    const p1 = Product.create({
      shoppingEventId: 'any_id',
      name: 'Product 1',
      amount: 2,
      price: 10,
      addedAt: new Date(),
      addedBy: 'any_user',
    });

    const products = Products.create([p1]);
    const shoppingEvent = ShoppingEvent.create({
      familyId: 'any_family',
      marketId: 'any_market',
      status: 'ONGOING',
      products,
      createdAt: new Date(),
      createdBy: 'any_user',
    });

    const dto = shoppingEvent.toSummaryDto();

    expect(dto.id).toBe(shoppingEvent.id);
    expect(dto.status).toBe('ONGOING');
    expect(dto.totals.totalItemsDistinct).toBe(1);
    expect(dto.totals.totalItemsQuantity).toBe(2);
    expect(dto.totals.highestPrice).toBe(10);
    expect(dto.totals.lowestPrice).toBe(10);
    expect(dto.totals.retailPaidDifferenceValue).toBeUndefined();
    expect(dto.totals.wholesalePaidDifferenceValue).toBeUndefined();
    expect(dto.products).toHaveLength(1);
    expect(dto.products[0].name).toBe('Product 1');
    expect(dto.products[0]).toHaveProperty('totalRetailPrice');
    expect(dto.products[0]).toHaveProperty('totalWholesalePrice');
    expect(dto.products[0]).toHaveProperty('totalDifference');
  });

  it('should handle empty products list correctly', () => {
    const products = Products.create([]);
    const shoppingEvent = ShoppingEvent.create({
      familyId: 'any_family',
      marketId: 'any_market',
      status: 'ONGOING',
      products,
      createdAt: new Date(),
      createdBy: 'any_user',
    });

    const totals = shoppingEvent.getCalculatedTotals();

    expect(totals.totalItemsDistinct).toBe(0);
    expect(totals.totalItemsQuantity).toBe(0);
    expect(totals.highestPrice).toBe(0);
    expect(totals.lowestPrice).toBe(0);
    expect(totals.savingsPercentage).toBe(0);
    expect(totals.savingsValue).toBe(0);
    expect(totals.averagePricePerUnit).toBe(0);
  });
});
