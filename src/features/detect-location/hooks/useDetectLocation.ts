import { useEffect, useState } from 'react';

import { type GeocodedLocationType } from '@/entities/location/model/types';
import { latLonToGrid } from '@/entities/location/lib/convertToGrid';
import useRegionFromCoordQuery from '@/entities/location/model/queries';

export type DetectedLocationType = GeocodedLocationType & {
  label: string;
  fullLabel: string;
};

const isGeolocationSupported = typeof navigator !== 'undefined' && !!navigator.geolocation;

const useDetectLocation = () => {
  const [coords, setCoords] = useState<GeocodedLocationType | null>(null);
  const [isLoading, setIsLoading] = useState(isGeolocationSupported);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isGeolocationSupported ? null : '브라우저가 위치 감지를 지원하지 않습니다.'
  );

  useEffect(() => {
    if (!isGeolocationSupported) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const { nx, ny } = latLonToGrid(latitude, longitude);
        setCoords({ latitude, longitude, nx, ny });
        setIsLoading(false);
      },
      () => {
        setErrorMessage('위치 접근 권한이 거부되었습니다.');
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const { data: region } = useRegionFromCoordQuery(coords?.latitude, coords?.longitude);

  const detectedLocation: DetectedLocationType | null = coords
    ? { ...coords, label: region?.region3DepthName || '', fullLabel: region?.addressName || '' }
    : null;

  return { detectedLocation, isLoading, errorMessage };
};

export default useDetectLocation;
