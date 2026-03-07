import { describe, expect, test } from 'vitest';
import { CanonicalProduct } from '../../../src/domain/entities/canonical-product';

describe('CanonicalProduct Entity', () => {
  test('should create a canonical product with name and brand', () => {
    const product = CanonicalProduct.create({
      name: 'Coca-Cola',
      brand: 'The Coca-Cola Company',
      description: 'Classic soft drink',
    });

    expect(product.name).toBe('Coca-Cola');
    expect(product.brand).toBe('The Coca-Cola Company');
    expect(product.description).toBe('Classic soft drink');
    expect(product.id).toBeDefined();
  });

  test('should validate that name is not empty', () => {
    expect(() =>
      CanonicalProduct.create({
        name: '',
      }),
    ).toThrow('Canonical product name is required');

    expect(() =>
      CanonicalProduct.create({
        name: '   ',
      }),
    ).toThrow('Canonical product name is required');
  });
});
