type GetItemsCountParams = 'currentItems' | 'new' | 'removed' | 'updated';

export abstract class WatchedList<T> {
  public currentItems: T[];
  private readonly initial: T[];
  private new: T[];
  private removed: T[];
  private updated: T[];

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems ?? [];
    this.initial = initialItems ? [...initialItems] : [];
    this.new = [];
    this.removed = [];
    this.updated = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  abstract compareProps(a: T, b: T): boolean;

  public getItems(): T[] {
    return this.currentItems;
  }

  public getItemsCount(
    list: GetItemsCountParams | undefined = 'currentItems',
  ): number {
    return this[list].length ?? this.currentItems.length;
  }

  public getNewItems(): T[] {
    return this.new;
  }

  public getRemovedItems(): T[] {
    return this.removed;
  }

  public getUpdatedItems(): T[] {
    return this.updated;
  }

  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    );
  }

  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0;
  }

  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    );
  }

  private isUpdatedItem(item: T): boolean {
    return (
      this.updated.filter((v: T) => this.compareItems(item, v)).length !== 0
    );
  }

  private hasChangedProps(item: T): boolean {
    const initialItem = this.initial.find((v) => this.compareItems(item, v));
    if (!initialItem) {
      return false;
    }
    return this.compareProps(item, initialItem);
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item));
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    );
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v));
  }

  private removeFromUpdated(item: T): void {
    this.updated = this.updated.filter((v) => !this.compareItems(item, v));
  }

  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    );
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item);
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item);
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item);
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item);
    }

    if (this.wasAddedInitially(item) && this.hasChangedProps(item)) {
      if (this.isUpdatedItem(item)) {
        this.removeFromUpdated(item);
      }

      this.removeFromCurrent(item);
      this.currentItems.push(item);

      this.updated.push(item);
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item);

    if (this.isNewItem(item)) {
      this.removeFromNew(item);
      return;
    }

    if (this.isUpdatedItem(item)) {
      this.removeFromUpdated(item);
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item);
    }
  }
}
