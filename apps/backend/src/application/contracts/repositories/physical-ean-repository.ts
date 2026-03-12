import type { PhysicalEAN } from '@/domain';

export interface PhysicalEanRepository {
  save(physical: PhysicalEAN, transaction?: unknown): Promise<void>;
  findByBarcode(barcode: string): Promise<PhysicalEAN | null>;
}
