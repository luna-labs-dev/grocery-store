import { Entity } from '../core';

export interface MarketProps {
  name: string;
  formattedAddress: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  geographicLocation?: string;
  locationTypes: string[];
  distance?: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface MarketDto {
  id: string;
  name: string;
  formattedAddress: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distance?: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

interface CreateMarketProps
  extends Pick<
    MarketProps,
    | 'name'
    | 'formattedAddress'
    | 'city'
    | 'neighborhood'
    | 'latitude'
    | 'longitude'
    | 'locationTypes'
  > {
  createdAt?: Date;
  lastUpdatedAt?: Date;
  geographicLocation?: string;
  distance?: number;
}

interface UpdateMarketProps
  extends Pick<
    MarketProps,
    | 'name'
    | 'formattedAddress'
    | 'city'
    | 'neighborhood'
    | 'latitude'
    | 'longitude'
    | 'geographicLocation'
    | 'locationTypes'
  > {}

export class Market extends Entity<MarketProps> {
  private constructor(props: MarketProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get formattedAddress(): string {
    return this.props.formattedAddress;
  }

  get city(): string {
    return this.props.city;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  get geographicLocation(): string | undefined {
    return this.props.geographicLocation;
  }

  get locationTypes(): string[] {
    return this.props.locationTypes;
  }

  get distance(): number | undefined {
    return this.props.distance;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastUpdatedAt(): Date {
    return this.props.lastUpdatedAt;
  }

  public toDto(): MarketDto {
    return {
      id: this.id,
      name: this.props.name,
      formattedAddress: this.props.formattedAddress,
      city: this.props.city,
      neighborhood: this.props.neighborhood,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      distance: this.props.distance,
      createdAt: this.props.createdAt,
      lastUpdatedAt: this.props.lastUpdatedAt,
    };
  }

  public update(props: UpdateMarketProps): void {
    this.props.name = props.name;
    this.props.formattedAddress = props.formattedAddress;
    this.props.city = props.city;
    this.props.neighborhood = props.neighborhood;
    this.props.latitude = props.latitude;
    this.props.longitude = props.longitude;
    this.props.geographicLocation = props.geographicLocation;
    this.props.locationTypes = props.locationTypes;
    this.props.lastUpdatedAt = new Date();
  }

  public static create(props: CreateMarketProps, id: string): Market {
    return new Market(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        lastUpdatedAt: props.lastUpdatedAt ?? new Date(),
      },
      id,
    );
  }
}
