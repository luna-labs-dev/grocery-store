export const VariableWeightParser = {
  /**
   * Barcodes starting with '2' often represent variable weight items.
   * Format: 2 (1 digit) + EAN-base (5 digits) + Weight/Price (5 digits) + Checksum (2 digits)
   * This is a common standard in Brazil (and some other regions).
   */
  isVariableWeight(barcode: string): boolean {
    return barcode.startsWith('2') && barcode.length === 13;
  },

  parse(barcode: string): { baseEan: string; value: number } {
    if (!this.isVariableWeight(barcode)) {
      throw new Error('Not a variable weight barcode');
    }

    // Example: 2 00123 01450 7
    // 2 (prefix)
    // 00123 (product identifier - 5 digits)
    // 01450 (value/weight - 5 digits) -> 14.50
    // 7 (checksum)

    // We treat it as 2XXXXX where XXXXX is the internal code
    const productCode = barcode.substring(1, 6);
    const valueStr = barcode.substring(7, 12);
    const value = Number.parseInt(valueStr, 10) / 100;

    return {
      baseEan: `2${productCode}`,
      value,
    };
  },
};
