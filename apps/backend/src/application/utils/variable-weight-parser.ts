export interface ParsedVariableWeight {
  barcode: string;
  weightInGrams?: number;
  totalPrice?: number;
  eanPart: string;
}

/**
 * Parses Brazilian EAN-13 barcodes starting with '2' (typically for variable weight items like meat/bakery).
 * Format: 2 [TTTTT] [PPPPP] [C]
 * - 2: Internal use prefix
 * - TTTTT: Product code (5 digits)
 * - PPPPP: Price or Weight (5 digits)
 * - C: Checksum
 */
export const parseVariableWeight = (
  barcode: string,
): ParsedVariableWeight | null => {
  if (!barcode.startsWith('2') || barcode.length !== 13) {
    return null;
  }

  const eanPart = barcode.substring(1, 6);
  const valueStr = barcode.substring(6, 11);
  const valuePart = Number.parseInt(valueStr, 10);

  // Standard Brazilian pattern: the 5 digits usually represent the total price in cents
  // Example: 2012345005007 -> product 012345, price 005.00 (5.00)
  return {
    barcode,
    totalPrice: valuePart / 100,
    eanPart,
  };
};
