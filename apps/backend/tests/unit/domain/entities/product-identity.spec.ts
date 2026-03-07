import { describe, expect, test } from 'vitest';
import { ProductIdentity } from '@/domain/entities/product-identity';

describe('ProductIdentity Entity', () => {
  test('should create a product identity with type and value', () => {
    const identity = ProductIdentity.create({
      canonicalProductId: 'canonical-1',
      type: 'EAN',
      value: '1234567890123',
    });

    expect(identity.canonicalProductId).toBe('canonical-1');
    expect(identity.type).toBe('EAN');
    expect(identity.value).toBe('1234567890123');
    expect(identity.id).toBeDefined();
  });

  test('should link to a parent CanonicalProduct', () => {
    const canonicalId = 'some-uuid';
    const identity = ProductIdentity.create({
      canonicalProductId: canonicalId,
      type: 'UPC',
      value: '123456',
    });

    expect(identity.canonicalProductId).toBe(canonicalId);
  });
});
