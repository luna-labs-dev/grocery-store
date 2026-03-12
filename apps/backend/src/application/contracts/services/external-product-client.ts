export interface ExternalProductResult {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  rawResponse: Record<string, unknown>;

  source: 'OFF' | 'UPCITEMDB';
}

export interface ExternalProductClient {
  fetchByBarcode(barcode: string): Promise<ExternalProductResult | null>;
}
