import { useEffect, useState } from 'react';

import { latLonToGrid } from '@/entities/location/lib/convertToGrid';

export type DetectedLocationType = {
  latitude: number; // 위도
  longitude: number; // 경도
  nx: number; // 격자 X 좌표
  ny: number; // 격자 Y 좌표
};

const isGeolocationSupported = typeof navigator !== 'undefined' && !!navigator.geolocation;

const useDetectLocation = () => {
  const [location, setLocation] = useState<DetectedLocationType | null>(null);
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
        setLocation({ latitude, longitude, nx, ny });
        setIsLoading(false);
      },
      () => {
        setErrorMessage('위치 접근 권한이 거부되었습니다.');
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return { location, isLoading, errorMessage };
};

export default useDetectLocation;
