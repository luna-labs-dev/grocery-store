import { Entity } from '../core';
import { nameToCode } from '../helper';

export interface MarketProps {
  code?: string;
  name: string;
  createdAt: Date;
  createdBy: string;
}

interface UpdateMarketProps {
  name: string;
}

export class Market extends Entity<MarketProps> {
  private constructor(props: MarketProps, id?: string) {
    super(props, id);
  }

  get code(): string {
    return this.props.code ?? nameToCode(this.props.name);
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  public update({ name }: UpdateMarketProps): void {
    this.props.name = name;
    this.props.code = nameToCode(name);
  }

  public static create(props: MarketProps, id?: string): Market {
    if (!props.code) {
      props.code = nameToCode(props.name);
    }

    return new Market(props, id);
  }
}
