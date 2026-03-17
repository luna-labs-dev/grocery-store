export interface ParsedVariableWeight {
  barcode: string;
  totalPrice?: number;
  weightInGrams?: number;
  eanPart: string;
}

/**
 * VariableWeightParser handles barcodes starting with '2' (typically for variable weight items).
 * Standard Brazilian EAN-13 Format: 2 [TTTTT] [PPPPP] [C]
 * - 2: Internal use prefix
 * - TTTTT: Product code (5 digits)
 * - PPPPP: Price (5 digits) in cents
 * - C: Checksum
 */
export const VariableWeightParser = {
  isVariableWeight(barcode: string): boolean {
    return barcode.startsWith('2') && barcode.length === 13;
  },

  parse(barcode: string): ParsedVariableWeight | null {
    if (!this.isVariableWeight(barcode)) {
      return null;
    }

    const eanPart = barcode.substring(1, 6);
    const valueStr = barcode.substring(6, 11);
    const valuePart = Number.parseInt(valueStr, 10);

    return {
      barcode,
      totalPrice: valuePart / 100,
      eanPart,
    };
  },
};
