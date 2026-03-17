import type { ExternalFetchLog } from '../../../domain/entities';

export interface ProductRepository {
  saveFetchLog(log: ExternalFetchLog): Promise<void>;
}
