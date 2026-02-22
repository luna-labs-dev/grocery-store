import type { AxiosInstance } from 'axios';
import { inject, injectable } from 'tsyringe';
import type {
  GooglePlacesHttpClient,
  GooglePlacesResponse,
  Place,
} from './google-places-http-client';
import type {
  GetNearByPlacesParams,
  GetNearByPlacesResult,
  Places,
} from '@/application';
import { injection } from '@/main/di/injection-codes';

const { infra } = injection;

@injectable()
export class GooglePlaces implements Places {
  private readonly httpClient: AxiosInstance;

  constructor(
    @inject(infra.placesHttpClient) httpFactory: GooglePlacesHttpClient,
  ) {
    this.httpClient = httpFactory.getHttpClient();
  }

  async getNearByPlaces(
    params: GetNearByPlacesParams,
  ): Promise<GetNearByPlacesResult[]> {
    const { latitude, longitude, radius, maxResults } = params;

    const result = await this.httpClient.post<GooglePlacesResponse>(
      '/places:searchNearby',
      {
        includedTypes: [
          'wholesaler',
          'supermarket',
          'hypermarket',
          'market',
          'grocery_store',
        ],
        excludedTypes: ['cake_shop', 'bakery', 'food_store', 'manufacturer'],
        maxResultCount: maxResults,
        rankPreference: 'DISTANCE',
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude,
            },
            radius,
          },
        },
      },
      {
        headers: {
          'X-Goog-FieldMask':
            'places(id,displayName,formattedAddress,location,types,addressComponents)',
        },
      },
    );

    const { places } = result.data;

    return places.map((place) => this.toGetNearByPlacesResult(place));
  }

  private toGetNearByPlacesResult(place: Place): GetNearByPlacesResult {
    const city = place.addressComponents.find((component) =>
      component.types?.includes('administrative_area_level_2'),
    )?.longText;

    const neighborhood = place.addressComponents.find((component) =>
      ['sublocality_level_1', 'sublocality'].some((item) =>
        component.types?.includes(item),
      ),
    )?.longText;

    return {
      id: place.id,
      types: place.types,
      name: place.displayName.text,
      formattedAddress: place.formattedAddress,
      city: city ?? '',
      neighborhood: neighborhood ?? '',
      location: {
        latitude: place.location.latitude,
        longitude: place.location.longitude,
      },
    };
  }
}
