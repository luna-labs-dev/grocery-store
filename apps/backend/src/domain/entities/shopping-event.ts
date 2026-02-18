import { Entity, TimerHelper } from '../core';
import { monetaryCalc } from '../helper';
import type { Family } from './family';
import type { Market } from './market';
import type { Product } from './product';
import type { Products } from './products';

export const validShoppingEventStatus = [
  'CANCELED',
  'FINISHED',
  'ONGOING',
] as const;
export type ShoppingEventStatus = (typeof validShoppingEventStatus)[number];

export interface ShoppingEventProps {
  familyId: string;
  family?: Family;
  marketId: string;
  market?: Market;
  description?: string;
  totalPaid?: number;
  wholesaleTotal?: number;
  retailTotal?: number;
  totalItemsDistinct?: number;
  totalItemsQuantity?: number;
  averagePricePerUnit?: number;
  highestPrice?: number;
  lowestPrice?: number;
  savingsPercentage?: number;
  savingsValue?: number;
  retailPaidDifferenceValue?: number;
  wholesalePaidDifferenceValue?: number;
  status: ShoppingEventStatus;
  products: Products;
  elapsedTime?: number;
  createdAt: Date;
  finishedAt?: Date;
  createdBy: string;
}

export class ShoppingEvent extends Entity<ShoppingEventProps> {
  private _isCalculated = false;

  private constructor(props: ShoppingEventProps, id?: string) {
    super(props, id);
    this.calculateTotals();
  }

  get familyId(): string {
    return this.props.familyId;
  }

  get family(): Family | undefined {
    return this.props.family;
  }

  get marketId(): string {
    return this.props.marketId;
  }

  get market(): Market | undefined {
    return this.props.market;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get totalPaid(): number | undefined {
    return this.props.totalPaid;
  }

  set totalPaid(totalPaid: number) {
    this.props.totalPaid = totalPaid;
    this._isCalculated = false;
  }

  get wholesaleTotal(): number | undefined {
    return this.props.wholesaleTotal;
  }

  set wholesaleTotal(wholesaleTotal: number) {
    this.props.wholesaleTotal = wholesaleTotal;
  }

  get retailTotal(): number | undefined {
    return this.props.retailTotal;
  }

  set retailTotal(retailTotal: number) {
    this.props.retailTotal = retailTotal;
  }

  get status(): ShoppingEventStatus {
    return this.props.status;
  }

  set status(status: ShoppingEventStatus) {
    this.props.status = status;
  }

  get products(): Products {
    return this.props.products;
  }

  get elapsedTime(): number | undefined {
    return this.props.elapsedTime;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get finishedAt(): Date | undefined {
    return this.props.finishedAt;
  }

  set finishedAt(finishedAt: Date) {
    this.props.finishedAt = finishedAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get totalItemsDistinct(): number | undefined {
    return this.props.totalItemsDistinct;
  }

  get totalItemsQuantity(): number | undefined {
    return this.props.totalItemsQuantity;
  }

  get averagePricePerUnit(): number | undefined {
    return this.props.averagePricePerUnit;
  }

  get highestPrice(): number | undefined {
    return this.props.highestPrice;
  }

  get lowestPrice(): number | undefined {
    return this.props.lowestPrice;
  }

  get savingsPercentage(): number | undefined {
    return this.props.savingsPercentage;
  }

  get savingsValue(): number | undefined {
    return this.props.savingsValue;
  }

  get retailPaidDifferenceValue(): number | undefined {
    return this.props.retailPaidDifferenceValue;
  }

  get wholesalePaidDifferenceValue(): number | undefined {
    return this.props.wholesalePaidDifferenceValue;
  }

  /**
   * Factory method to create a new ShoppingEvent instance.
   */
  public static create(props: ShoppingEventProps, id?: string): ShoppingEvent {
    const entity = new ShoppingEvent(props, id);
    return entity;
  }

  /**
   * Finalizes the shopping event, setting the total paid amount and status.
   */
  end = (totalPaid: number): void => {
    this.props.totalPaid = totalPaid;
    this.props.status = 'FINISHED';
    this.props.finishedAt = new Date();
    this.props.elapsedTime = TimerHelper.calculateDuration(
      this.props.createdAt,
    );
  };

  /**
   * Adds a product to the event and invalidates current calculations.
   */
  addProduct = (product: Product): void => {
    this.props.products.add(product);
    this._isCalculated = false;
  };

  /**
   * Removes a product from the event and invalidates current calculations.
   */
  removeProduct = (product: Product) => {
    this.props.products.remove(product);
    this._isCalculated = false;
  };

  /**
   * Orchestrates the calculation of all event totals and metrics.
   * Uses a step-by-step approach to ensure clarity and maintainability.
   */
  private calculateTotals(): void {
    const items = this.props.products.getItems();

    // 1. If no products, reset all totals to zero/undefined and return early
    if (items.length === 0) {
      this.resetTotals();
      this._isCalculated = true;
      return;
    }

    // 2. Iterate over products to sum totals and find min/max prices
    const metrics = this.calculateProductMetrics(items);

    // 3. Apply the calculated metrics to the entity properties
    this.applyMetrics(metrics, items.length);

    // 4. Calculate savings (percentage and value) based on retail vs wholesale
    this.calculateSavings();

    // 5. Calculate average price per unit
    this.calculateAveragePrice();

    // 6. Calculate differences between paid value and expected totals
    this.calculateDifferences();

    this._isCalculated = true;
  }

  /**
   * Resets all calculated fields to their default zero/undefined state.
   */
  private resetTotals(): void {
    this.props.retailTotal = 0;
    this.props.wholesaleTotal = 0;
    this.props.totalItemsDistinct = 0;
    this.props.totalItemsQuantity = 0;
    this.props.highestPrice = 0;
    this.props.lowestPrice = 0;
    this.props.savingsPercentage = 0;
    this.props.savingsValue = 0;
    this.props.averagePricePerUnit = 0;
    this.props.retailPaidDifferenceValue = undefined;
    this.props.wholesalePaidDifferenceValue = undefined;
  }

  /**
   * Iterates through products to calculate aggregated metrics like sums and min/max prices.
   */
  private calculateProductMetrics(items: Product[]) {
    // Initialize lowestPrice with the first product's price to avoid Number.MAX_VALUE
    let lowestPrice = items[0].price;
    let highestPrice = 0;
    let retailTotal = 0;
    let wholesaleTotal = 0;
    let totalItemsQuantity = 0;

    for (const product of items) {
      const calculatedTotal = product.getCalculatedTotals();

      retailTotal += calculatedTotal.totalsRetailOnly;
      wholesaleTotal += calculatedTotal.totalsWithWhosale;
      totalItemsQuantity += product.amount;

      if (product.price > highestPrice) highestPrice = product.price;
      if (product.price < lowestPrice) lowestPrice = product.price;
    }

    return {
      retailTotal,
      wholesaleTotal,
      totalItemsQuantity,
      highestPrice,
      lowestPrice,
    };
  }

  /**
   * Applies the calculated metrics from the product iteration to the entity's properties.
   */
  private applyMetrics(
    metrics: ReturnType<typeof this.calculateProductMetrics>,
    totalDistinct: number,
  ): void {
    this.props.retailTotal = metrics.retailTotal;
    this.props.wholesaleTotal = metrics.wholesaleTotal;
    this.props.totalItemsDistinct = totalDistinct;
    this.props.totalItemsQuantity = metrics.totalItemsQuantity;
    this.props.highestPrice = metrics.highestPrice;
    this.props.lowestPrice = metrics.lowestPrice;
  }

  /**
   * Calculates the savings percentage and the total value saved (Retail - Wholesale).
   */
  private calculateSavings(): void {
    // If no retail total, there are no savings to calculate
    if (!this.props.retailTotal || this.props.retailTotal <= 0) {
      this.props.savingsPercentage = 0;
      this.props.savingsValue = 0;
      return;
    }

    const retailTotalInCents = monetaryCalc.toCents(this.props.retailTotal);
    const wholesaleTotalInCents = monetaryCalc.toCents(
      this.props.wholesaleTotal ?? 0,
    );
    const savings = this.props.retailTotal - (this.props.wholesaleTotal ?? 0);

    this.props.savingsPercentage = (savings / this.props.retailTotal) * 100;
    this.props.savingsValue = monetaryCalc.toReais(
      retailTotalInCents - wholesaleTotalInCents,
    );
  }

  /**
   * Calculates the average price per unit based on the total paid value (or wholesale total if unpaid).
   */
  private calculateAveragePrice(): void {
    // Determine which value to use for average calculation (Paid > Wholesale)
    const paidValue = this.props.totalPaid ?? this.props.wholesaleTotal;

    // Avoid division by zero
    if (this.props.totalItemsQuantity && this.props.totalItemsQuantity > 0) {
      this.props.averagePricePerUnit =
        (paidValue ?? 0) / this.props.totalItemsQuantity;
      return;
    }

    this.props.averagePricePerUnit = 0;
  }

  /**
   * Calculates the difference between the actual paid value and the expected retail/wholesale totals.
   * Only calculates if a totalPaid value is set and greater than zero.
   */
  private calculateDifferences(): void {
    // If nothing was paid yet, we can't calculate differences
    if (this.totalPaid === undefined || this.totalPaid <= 0) {
      this.props.retailPaidDifferenceValue = undefined;
      this.props.wholesalePaidDifferenceValue = undefined;
      return;
    }

    const totalPaidInCents = monetaryCalc.toCents(this.totalPaid);

    // Calculate Retail Difference
    if (this.retailTotal !== undefined) {
      const retailTotalInCents = monetaryCalc.toCents(this.retailTotal);
      this.props.retailPaidDifferenceValue = monetaryCalc.toReais(
        totalPaidInCents - retailTotalInCents,
      );
    } else {
      this.props.retailPaidDifferenceValue = 0;
    }

    // Calculate Wholesale Difference
    if (this.wholesaleTotal !== undefined) {
      const wholeSaleInCents = monetaryCalc.toCents(this.wholesaleTotal);
      this.props.wholesalePaidDifferenceValue = monetaryCalc.toReais(
        totalPaidInCents - wholeSaleInCents,
      );
    } else {
      this.props.wholesalePaidDifferenceValue = 0;
    }
  }

  /**
   * Returns the calculated totals.
   * If the entity state is dirty (not calculated), it triggers a calculation first.
   */
  public getCalculatedTotals() {
    if (!this._isCalculated) {
      this.calculateTotals();
    }

    return {
      retailTotal: this.props.retailTotal,
      wholesaleTotal: this.props.wholesaleTotal,
      paidValue: this.props.totalPaid,
      savingsValue: this.props.savingsValue,
      savingsPercentage: this.props.savingsPercentage,
      retailPaidDifferenceValue: this.props.retailPaidDifferenceValue,
      wholesalePaidDifferenceValue: this.props.wholesalePaidDifferenceValue,
      totalItemsDistinct: this.props.totalItemsDistinct,
      totalItemsQuantity: this.props.totalItemsQuantity,
      averagePricePerUnit: this.props.averagePricePerUnit,
      highestPrice: this.props.highestPrice,
      lowestPrice: this.props.lowestPrice,
    };
  }

  /**
   * Converts the entity to a comprehensive summary DTO used by the API.
   * Includes nested calculated totals for consistency.
   */
  public toSummaryDto() {
    return {
      id: this.id,
      status: this.status,
      market: this.market
        ? {
            id: this.marketId,
            code: this.market.code,
            name: this.market.name,
            createdAt: this.market.createdAt,
          }
        : {
            id: this.marketId,
          },
      totals: this.getCalculatedTotals(),
      products: this.products.getItems().map((prod) => {
        const { totalsRetailOnly, totalsWithWhosale, totalsDifference } =
          prod.getCalculatedTotals();
        return {
          id: prod.id,
          name: prod.name,
          amount: prod.amount,
          wholesaleMinAmount: prod.wholesaleMinAmount,
          price: prod.price,
          wholesalePrice: prod.wholesalePrice,
          totalRetailPrice: totalsRetailOnly,
          totalWholesalePrice: totalsWithWhosale,
          totalDifference: totalsDifference,
          addedAt: prod.addedAt,
        };
      }),
      elapsedTime: this.elapsedTime,
      createdAt: this.createdAt,
      finishedAt: this.finishedAt,
      createdBy: this.createdBy,
    };
  }
}
