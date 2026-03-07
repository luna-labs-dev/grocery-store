import { Entity } from '../core';

export interface ProductIdentityProps {
  canonicalProductId: string;
  type: string;
  value: string;
  createdAt: Date;
}

export interface CreateProductIdentityProps {
  canonicalProductId: string;
  type: string;
  value: string;
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
