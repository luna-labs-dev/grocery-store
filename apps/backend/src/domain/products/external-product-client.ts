export interface ExternalProductMatch {
  name: string;
  brand?: string;
  imageUrl?: string;
  rawPayload: Record<string, unknown>;
  source: 'OFF' | 'UPCITEMDB';
}

export interface ExternalProductClient {
  fetchByBarcode(barcode: string): Promise<ExternalProductMatch | null>;
}
