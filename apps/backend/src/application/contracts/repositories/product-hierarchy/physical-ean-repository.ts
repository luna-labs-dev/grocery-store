import type { PhysicalEAN } from '@/domain';

export interface PhysicalEanRepository {
  save(physical: PhysicalEAN): Promise<void>;
  findByBarcode(barcode: string): Promise<PhysicalEAN | null>;
}
