import { useState } from 'react';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import type { GeocodedLocationType } from '@/entities/location/api/getGeocodeAddress';
import type { SearchResultType } from '@/entities/location/lib/searchDistricts';
import useRegionFromCoordQuery from '@/entities/location/model/queries';
import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import useDetectLocation from '@/features/detect-location/hooks/useDetectLocation';
import PageContainer from '@/shared/ui/page-container/PageContainer';
import BookmarkCard from '@/widgets/bookmark-card/ui/BookmarkCard';
import LocationSearch from '@/widgets/location-search/ui/LocationSearch';

type SearchedLocationType = SearchResultType & Partial<GeocodedLocationType>;

const WeatherHomePage = () => {
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocationType | null>(null);
  const { bookmarks, addBookmark, removeBookmark, updateBookmarkAlias } = useBookmarks();

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

  if (isLocating) {
    return (
      <PageContainer>
        <LocationSearch onRequestSelectedLocation={handleSelectLocation} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">위치를 감지하는 중...</p>
        </div>
      </PageContainer>
    );
  }

  if (locationErrorMessage && !activeLocation) {
    return (
      <PageContainer>
        <LocationSearch onRequestSelectedLocation={handleSelectLocation} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{locationErrorMessage}</p>
        </div>
      </PageContainer>
    );
  }

  if (isWeatherLoading) {
    return (
      <PageContainer>
        <LocationSearch onRequestSelectedLocation={handleSelectLocation} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">날씨 정보를 불러오는 중...</p>
        </div>
      </PageContainer>
    );
  }

  if (weatherError || !weather) {
    return (
      <PageContainer>
        <LocationSearch onRequestSelectedLocation={handleSelectLocation} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">해당 장소의 정보가 제공되지 않습니다.</p>
        </div>
      </PageContainer>
    );
  }

  const { currentWeather, daily, hourly } = weather;
  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  const { latitude, longitude, nx, ny } = activeLocation as GeocodedLocationType;
  const bookmarkTarget: BookmarkType = {
    // 검색 위치는 지역 문자열(안정적), 감지 위치는 region 이름(GPS 오차 없음)
    id: locationLabel,
    alias: locationLabel,
    label: locationLabel,
    fullLabel: locationLabel,
    latitude,
    longitude,
    nx,
    ny,
  };

  const bookmarked = bookmarks.some(b => b.id === bookmarkTarget.id);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(bookmarkTarget.id);
    } else {
      addBookmark(bookmarkTarget);
    }
  };

  return (
    <PageContainer>
      <LocationSearch onRequestSelectedLocation={handleSelectLocation} />

      <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm text-white/60">{locationLabel}</p>
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className="text-xl leading-none"
            aria-label={bookmarked ? '북마크 삭제' : '북마크 추가'}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
        <div className="mt-2 flex flex-col gap-4">
          <span className="text-7xl font-normal text-white">{currentWeather.temperature}°</span>
          <span className="mb-2 text-xl text-white/80">{conditionLabel}</span>
        </div>
        <div className="mt-4 text-sm">
          {daily.minDailyTemperature !== null && daily.maxDailyTemperature !== null ? (
            <div className="flex flex-wrap gap-x-4 text-white/70">
              <span>
                최저 <span className="font-normal text-white">{daily.minDailyTemperature}°</span>
              </span>
              <span>
                최고 <span className="font-normal text-white">{daily.maxDailyTemperature}°</span>
              </span>
            </div>
          ) : (
            <span className="text-white/55">제공된 최고/최저 기온 데이터가 없어요.</span>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-medium text-white/60">시간대별 기온</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hourly.map(item => {
            const hourlyConditionLabel =
              item.pty !== 0 ? PTY_LABEL[item.pty] : SKY_LABEL[item.sky ?? 1];
            return (
              <div
                key={`${item.fcstDate}_${item.fcstTime}`}
                className="flex min-w-20 flex-col items-center gap-1 rounded-xl bg-white/10 px-2 py-3 text-white"
              >
                <span className="text-xs text-white/60">
                  {item.fcstTime.slice(0, 2)}:{item.fcstTime.slice(2, 4)}
                </span>
                <span className="text-xs text-white/60">{hourlyConditionLabel}</span>
                <span className="text-sm font-medium">{item.temperature}°</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium text-white/60">북마크</h3>
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {bookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onRemoveBookmark={removeBookmark}
                onUpdateBookmarkAlias={updateBookmarkAlias}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/40">현재 추가된 북마크가 없어요.</p>
        )}
      </section>
    </PageContainer>
  );
};

export default WeatherHomePage;
