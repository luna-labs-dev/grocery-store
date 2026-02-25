import {
  GooglePlaces,
  GooglePlacesHttpClient,
} from '../infrastructure/services';
import { env } from '@/main/config/env';

const { apiKey, baseURL } = env.googlePlaces;
const run = async () => {
  const httpCLientFactory = new GooglePlacesHttpClient({
    apiKey,
    baseURL,
  });
  const googlePlaces = new GooglePlaces(httpCLientFactory);

  const resp = await googlePlaces.getNearByPlaces({
    latitude: -23.602461,
    longitude: -46.913607,
    maxResults: 20,
  });

  console.log({ resp });
};
run();
