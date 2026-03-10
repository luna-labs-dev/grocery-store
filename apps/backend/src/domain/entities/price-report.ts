import { v4 as uuid } from 'uuid';

export interface PriceReportProps {
  id?: string;
  userId: string;
  marketId: string;
  productIdentityId: string;
  price: number;
  reportedAt: Date;
  isOutlier: boolean;
}

export class PriceReport {
  private readonly _id: string;
  private readonly props: PriceReportProps;

  private constructor(props: PriceReportProps) {
    this._id = props.id ?? uuid();
    this.props = props;
  }

  static create(props: PriceReportProps): PriceReport {
    return new PriceReport(props);
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get marketId(): string {
    return this.props.marketId;
  }

  get productIdentityId(): string {
    return this.props.productIdentityId;
  }

  get price(): number {
    return this.props.price;
  }

  get reportedAt(): Date {
    return this.props.reportedAt;
  }

  get isOutlier(): boolean {
    return this.props.isOutlier;
  }
}
