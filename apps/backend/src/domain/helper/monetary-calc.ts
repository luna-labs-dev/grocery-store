export const monetaryCalc = {
  // Function to convert a monetary value to cents
  toCents: (value: number): number => {
    return Math.round(value * 100);
  },

  // Function to convert cents back to dollars
  toReais: (cents: number): number => {
    return cents / 100;
  },
};
