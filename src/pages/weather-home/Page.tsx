import { useState } from 'react';

import type { SearchResultType } from '@/entities/location/lib/searchDistricts';
import type { GeocodedLocationType } from '@/entities/location/model/types';
import useDetectLocation, {
  type DetectedLocationType,
} from '@/features/detect-location/hooks/useDetectLocation';
import PageContainer from '@/shared/ui/page-container/PageContainer';
import BookmarkSection from '@/widgets/bookmark-section/BookmarkSection';
import LocationSearch from '@/widgets/location-search/LocationSearch';
import WeatherInfo from '@/widgets/weather-info/WeatherInfo';

type SearchedLocationType = SearchResultType & Partial<GeocodedLocationType>;

const WeatherHomePage = () => {
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocationType | null>(null);

  const {
    detectedLocation,
    isLoading: isLocating,
    errorMessage: locationErrorMessage,
  } = useDetectLocation();

  // 검색으로 선택한 위치가 있으면 그걸 쓰고, 없으면 감지된 위치 사용
  const activeLocation = searchedLocation ?? detectedLocation;

  const statusMessage = isLocating
    ? '위치를 감지하는 중...'
    : !activeLocation
      ? (locationErrorMessage ?? '위치 정보를 가져올 수 없습니다.')
      : null;

  return (
    <PageContainer>
      <LocationSearch onRequestSelectedLocation={setSearchedLocation} />

      {statusMessage ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{statusMessage}</p>
        </div>
      ) : (
        <>
          <WeatherInfo activeLocation={activeLocation as DetectedLocationType} />
          <BookmarkSection />
        </>
      )}
    </PageContainer>
  );
};

export default WeatherHomePage;
