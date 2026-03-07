export interface ExternalProductData {
  name: string;
  brand?: string;
  description?: string;
}

export interface ExternalProductClient {
  fetchByBarcode(barcode: string): Promise<ExternalProductData | null>;
}
