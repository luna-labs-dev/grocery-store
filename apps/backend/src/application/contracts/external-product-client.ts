export interface ExternalProductMatch {
  name: string;
  brand?: string;
  description?: string;
  imageUrl?: string;
  rawPayload: Record<string, unknown>;
  source: 'OFF' | 'UPCITEMDB';
}

export interface ExternalProductClient {
  fetchByBarcode(barcode: string): Promise<ExternalProductMatch | undefined>;
}
