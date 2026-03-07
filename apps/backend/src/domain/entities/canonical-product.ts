import { Entity } from '../core';
import { ProductHierarchyValidationException } from '../exceptions/product-hierarchy-exceptions';

export interface CanonicalProductProps {
  name: string;
  brand?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCanonicalProductProps {
  name: string;
  brand?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CanonicalProduct extends Entity<CanonicalProductProps> {
  private constructor(props: CanonicalProductProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get brand(): string | undefined {
    return this.props.brand;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(
    props: CreateCanonicalProductProps,
    id?: string,
  ): CanonicalProduct {
    if (!props.name || props.name.trim().length === 0) {
      throw new ProductHierarchyValidationException(
        'Canonical product name is required',
      );
    }

    return new CanonicalProduct(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }

  public hydrate(data: {
    name: string;
    brand?: string;
    description?: string;
  }): void {
    this.props.name = data.name;
    if (data.brand) this.props.brand = data.brand;
    if (data.description) this.props.description = data.description;
    this.props.updatedAt = new Date();
  }
}
