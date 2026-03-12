import { Entity } from '../core';

export interface ProductIdentityProps {
  canonicalProductId: string;
  type: string;
  value: string;
  name?: string;
  brand?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface CreateProductIdentityProps {
  canonicalProductId: string;
  type: string;
  value: string;
  name?: string;
  brand?: string;
  imageUrl?: string;
  createdAt?: Date;
}

export class ProductIdentity extends Entity<ProductIdentityProps> {
  private constructor(props: ProductIdentityProps, id?: string) {
    super(props, id);
  }

  get canonicalProductId(): string {
    return this.props.canonicalProductId;
  }

  get type(): string {
    return this.props.type;
  }

  get value(): string {
    return this.props.value;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get brand(): string | undefined {
    return this.props.brand;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: CreateProductIdentityProps,
    id?: string,
  ): ProductIdentity {
    return new ProductIdentity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
