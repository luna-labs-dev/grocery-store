export type ScanMatchType =
  | 'LOCAL'
  | 'EXTERNAL'
  | 'VARIABLE_WEIGHT'
  | 'NOT_FOUND';

export interface ScanProductResult {
  matchType: ScanMatchType;
  product?: {
    id?: string;
    name: string;
    brand?: string;
    imageUrl?: string;
  };
  variableWeight?: {
    totalPrice?: number;
    weightInGrams?: number;
  };
  requiresPriceConfirmation: boolean;
  source: 'local' | 'external' | 'variable-weight' | 'none';
}

export interface IScanProductUseCase {
  execute(barcode: string): Promise<ScanProductResult>;
}
