import { Entity } from '../core';
import type { ShoppingEvent } from './shopping-event';

export interface ProductProps {
  shoppingEventId: string;
  shoppingEvent?: ShoppingEvent;
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
  totalRetailPrice?: number;
  totalWholesalePrice?: number;
  totalDifference?: number;
  addedAt: Date;
  addedBy: string;
}

export interface UpdateProps {
  name: string;
  amount: number;
  wholesaleMinAmount?: number;
  price: number;
  wholesalePrice?: number;
}

export interface ProductGetCalculatedTotals {
  totalsRetailOnly: number;
  totalsWithWhosale: number;
  totalsDifference: number;
}
export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
    this.calculateTotalPrice();
  }

  get shoppingEventId(): string {
    return this.props.shoppingEventId;
  }

  get shoppingEvent(): ShoppingEvent | undefined {
    return this.props.shoppingEvent;
  }

  get name(): string {
    return this.props.name;
  }

  get amount(): number {
    return this.props.amount;
  }

  get wholesaleMinAmount(): number | undefined {
    return this.props.wholesaleMinAmount;
  }

  get price(): number {
    return this.props.price;
  }

  get wholesalePrice(): number | undefined {
    return this.props.wholesalePrice;
  }

  get totalRetailPrice(): number {
    return this.props.totalRetailPrice ?? 0;
  }

  get totalWholesalePrice(): number {
    return this.props.totalWholesalePrice ?? 0;
  }

  get totalDifference(): number {
    return this.props.totalDifference ?? 0;
  }

  get addedAt(): Date {
    return this.props.addedAt;
  }

  get addedBy(): string {
    return this.props.addedBy;
  }

  getCalculatedTotals(): ProductGetCalculatedTotals {
    return {
      totalsRetailOnly: this.totalRetailPrice,
      totalsWithWhosale:
        this.props.totalWholesalePrice ?? this.totalRetailPrice,
      totalsDifference: this.totalDifference,
    };
  }

  private calculateTotalPrice(): void {
    this.props.totalRetailPrice = this.props.amount * this.props.price;
    if (
      !this.wholesaleMinAmount ||
      !this.wholesalePrice ||
      this.amount < this.wholesaleMinAmount
    ) {
      this.props.totalDifference = 0;
      return;
    }

    this.props.totalWholesalePrice = this.amount * this.wholesalePrice;

    this.props.totalDifference =
      this.totalRetailPrice - this.totalWholesalePrice;
  }

  update({
    name,
    amount,
    price,
    wholesaleMinAmount,
    wholesalePrice,
  }: UpdateProps): void {
    this.props.name = name;
    this.props.amount = amount;
    this.props.price = price;
    this.props.wholesaleMinAmount = wholesaleMinAmount;
    this.props.wholesalePrice = wholesalePrice;
    this.calculateTotalPrice();
  }

  public static create(props: ProductProps, id?: string): Product {
    const entity = new Product(props, id);
    return entity;
  }
}
