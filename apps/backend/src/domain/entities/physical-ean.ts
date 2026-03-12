import { Entity } from '../core';

export interface PhysicalEANProps {
  barcode: string;
  productIdentityId: string;
  source: string;
  createdAt: Date;
}

export interface CreatePhysicalEANProps {
  barcode: string;
  productIdentityId: string;
  source?: string;
  createdAt?: Date;
}

export class PhysicalEAN extends Entity<PhysicalEANProps> {
  private constructor(props: PhysicalEANProps, id?: string) {
    super(props, id);
  }

  get barcode(): string {
    return this.props.barcode;
  }

  get productIdentityId(): string {
    return this.props.productIdentityId;
  }

  get source(): string {
    return this.props.source;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: CreatePhysicalEANProps,
    id?: string,
  ): PhysicalEAN {
    return new PhysicalEAN(
      {
        ...props,
        source: props.source ?? 'LOCAL',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
