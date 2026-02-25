import axios, { type AxiosInstance } from 'axios';

export interface GooglePlacesResponse {
  places?: Place[];
}

export interface Place {
  id: string;
  types: string[];
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location: Location;
  displayName: DisplayName;
}

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface GooglePlacesHttpClientOptions {
  apiKey: string;
  baseURL: string;
}

export class GooglePlacesHttpClient {
  private httpClient: AxiosInstance | undefined;
  constructor(private readonly options: GooglePlacesHttpClientOptions) {}

  getHttpClient(): AxiosInstance {
    if (!this.httpClient) {
      this.httpClient = this.createHttpClient();
    }

    return this.httpClient;
  }

  private createHttpClient(): AxiosInstance {
    const { apiKey, ...axiosDefaults } = this.options;
    return axios.create({
      ...axiosDefaults,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
    });
  }
}
