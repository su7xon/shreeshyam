export type PriceOverride = {
  name: string;
  price: number;
};

/**
 * Keep this file ONLY as a helper for future automation.
 * Current data overrides are in:
 * - products-data.ts
 * - lib/accessories-data.ts
 */
export const priceOverrides: PriceOverride[] = [];
