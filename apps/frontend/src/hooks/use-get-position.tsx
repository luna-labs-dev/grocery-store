import { useState } from 'react';

export interface LocationData {
  latitude?: number;
  longitude?: number;
  error?: string;
}

export const useGetPosition = () => {
  const [location, setLocation] = useState<LocationData>({});

  const getPosition = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'The request to get user location timed out.';
            break;
        }
        setLocation((prev) => ({ ...prev, error: msg }));
      },
      {
        enableHighAccuracy: true,
        timeout: 1000 * 60 * 2,
        maximumAge: 0,
      },
    );
  };

  return { location, getPosition };
};
