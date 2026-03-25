import { useState } from 'react';

import type { GeocodedLocationType } from '@/entities/location/api/getGeocodeAddress';
import type { SearchResultType } from '@/entities/location/lib/searchDistricts';
import useRegionFromCoordQuery from '@/entities/location/model/queries';
import useWeatherQuery from '@/entities/weather/model/queries';
import useDetectLocation from '@/features/detect-location/hooks/useDetectLocation';
import PageContainer from '@/shared/ui/page-container/PageContainer';
import BookmarkList from '@/widgets/bookmark-list/BookmarkList';
import LocationSearch from '@/widgets/location-search/LocationSearch';
import WeatherInfo from '@/widgets/weather-info/WeatherInfo';

type SearchedLocationType = SearchResultType & Partial<GeocodedLocationType>;

const WeatherHomePage = () => {
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocationType | null>(null);

  const {
    location: detectedLocation,
    isLoading: isLocating,
    errorMessage: locationErrorMessage,
  } = useDetectLocation();

  // 검색으로 선택한 위치가 있으면 그걸 쓰고, 없으면 감지된 위치 사용
  const activeLocation = searchedLocation ?? detectedLocation;

  const { data: region } = useRegionFromCoordQuery(
    activeLocation?.latitude,
    activeLocation?.longitude
  );
  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherQuery(activeLocation?.nx, activeLocation?.ny);

  const locationLabel = searchedLocation
    ? searchedLocation.fullLabel
    : region
      ? `${region.region1DepthName} ${region.region2DepthName} ${region.region3DepthName}`
      : '현재 위치';

  const handleSelectLocation = (
    result: SearchResultType,
    location: GeocodedLocationType | null
  ) => {
    setSearchedLocation({ ...result, ...(location ?? {}) });
  };

  const statusMessage = isLocating
    ? '위치를 감지하는 중...'
    : locationErrorMessage && !activeLocation
      ? locationErrorMessage
      : isWeatherLoading
        ? '날씨 정보를 불러오는 중...'
        : weatherError || !weather
          ? '해당 장소의 정보가 제공되지 않습니다.'
          : null;

  return (
    <PageContainer>
      <LocationSearch onRequestSelectedLocation={handleSelectLocation} />

      {statusMessage ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{statusMessage}</p>
        </div>
      ) : (
        <>
          <WeatherInfo
            weather={weather!}
            locationLabel={locationLabel}
            activeLocation={activeLocation as GeocodedLocationType}
          />
          <BookmarkList />
        </>
      )}
    </PageContainer>
  );
};

export default WeatherHomePage;
