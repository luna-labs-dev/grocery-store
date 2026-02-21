export interface GetNearByPlacesParams {
  latitude: number;
  longitude: number;
  radius: number;
  maxResults: number;
}

export interface GetNearByPlacesResult {
  id: string;
  types: string[];
  name: string;
  formattedAddress: string;
  city: string;
  neighborhood: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Places {
  getNearByPlaces(
    params: GetNearByPlacesParams,
  ): Promise<GetNearByPlacesResult[]>;
}
