import { WatchedList } from '../core';
import type { Product, ProductProps } from './product';

export class Products extends WatchedList<Product> {
  compareItems(a: Product, b: Product): boolean {
    return a.id === b.id;
  }

  compareProps(a: Product, b: Product): boolean {
    const propsToCompare = [
      'name',
      'amount',
      'price',
      'wholesaleMinAmount',
      'wholesalePrice',
    ] as Array<keyof ProductProps>;

    return !propsToCompare.every((prop) => {
      return a[prop] === b[prop];
    });
  }

  getItemById(id: string): Product | undefined {
    return this.currentItems.find((prod) => prod.id === id);
  }

  private constructor(products: Product[]) {
    super(products);
  }

  public static create(products?: Product[]): Products {
    return new Products(products ?? []);
  }
}
