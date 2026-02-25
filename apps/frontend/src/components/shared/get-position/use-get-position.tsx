import { useEffect, useState } from 'react';

export interface LocationData {
  latitude?: number;
  longitude?: number;
  error?: string;
}

export type CustomPermissionState = PermissionState | 'prompted' | 'loading';

export const useGetPosition = () => {
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [location, setLocation] = useState<LocationData>({});
  const [permissionStatus, setPermissionStatus] =
    useState<CustomPermissionState>('loading');

  useEffect(() => {
    if (!navigator.permissions) {
      setPermissionStatus('prompt');
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      setPermissionStatus(status.state);

      status.onchange = () => {
        setPermissionStatus(status.state);
      };
    });
  }, []);

  useEffect(() => {
    if (permissionStatus === 'granted') {
      setPermissionDialogOpen(false);
      getPosition();
      return;
    }

    if (permissionStatus === 'loading') {
      return;
    }

    setPermissionDialogOpen(true);
  }, [permissionStatus]);

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

  const promptUser = () => {
    setPermissionStatus('prompted');
    getPosition();
  };

  return {
    location,
    permissionStatus,
    promptUser,
    permissionDialogOpen,
    setPermissionDialogOpen,
  };
};
