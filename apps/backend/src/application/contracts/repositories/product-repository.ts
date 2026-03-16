import type {
  ExternalFetchLog,
  PhysicalEAN,
  ProductIdentity,
} from '../../../domain/entities';

export interface ProductRepository {
  findPhysicalByBarcode(barcode: string): Promise<PhysicalEAN | null>;
  findIdentityById(id: string): Promise<ProductIdentity | null>;
  findIdentityByEAN(barcode: string): Promise<ProductIdentity | null>;
  savePhysical(physical: PhysicalEAN): Promise<void>;
  saveIdentity(identity: ProductIdentity): Promise<void>;
  saveFetchLog(log: ExternalFetchLog): Promise<void>;
  searchIdentities(query: string): Promise<ProductIdentity[]>;
}
