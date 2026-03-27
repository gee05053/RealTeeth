import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import { getCurrentWeatherConditionLabel } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import HourlyForecastRow from '@/entities/weather/ui/HourlyForecastRow';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import type { DetectedLocationType } from '@/features/detect-location/hooks/useDetectLocation';
import IconButton from '@/shared/ui/button/IconButton';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

type WeatherInfoProps = {
  activeLocation: DetectedLocationType;
};

const WeatherInfo = ({ activeLocation }: WeatherInfoProps) => {
  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherQuery(activeLocation.nx, activeLocation.ny);

  const locationLabel = activeLocation?.label || activeLocation?.fullLabel || '';

  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const bookmarkTarget: BookmarkType = {
    id: locationLabel,
    alias: locationLabel,
    label: locationLabel,
    fullLabel: activeLocation?.fullLabel || locationLabel,
    latitude: activeLocation.latitude,
    longitude: activeLocation.longitude,
    nx: activeLocation.nx,
    ny: activeLocation.ny,
  };

  const isBookmarked = bookmarks.some(b => b.id === bookmarkTarget.id);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(bookmarkTarget.id);
    } else {
      addBookmark(bookmarkTarget);
    }
  };

  const weatherStatusMessage = isWeatherLoading
    ? '날씨 정보를 불러오는 중...'
    : weatherError || !weather
      ? '해당 장소의 정보가 제공되지 않습니다.'
      : null;

  if (weatherStatusMessage)
    return (
      <Card classNames={{ content: 'flex justify-center' }}>
        <InlineMessage>{weatherStatusMessage}</InlineMessage>
      </Card>
    );

  const { currentWeather, daily, hourly } = weather!;

  return (
    <Card className="relative" classNames={{ content: 'flex flex-col gap-4' }}>
      <IconButton className="absolute top-5 right-5 size-10" onClick={handleBookmarkToggle}>
        {isBookmarked ? (
          <BookmarkSolidIcon className="size-6 text-yellow-300" />
        ) : (
          <BookmarkOutlineIcon className="size-6" />
        )}
      </IconButton>
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg">{locationLabel}</p>
        <span className="relative text-5xl">
          {currentWeather.temperature.toFixed(0)}
          <span className="absolute text-2xl">°</span>
        </span>
        <span className="text-base text-white/90">
          {getCurrentWeatherConditionLabel(currentWeather)}
        </span>
        {daily.minDailyTemperature !== null && daily.maxDailyTemperature !== null ? (
          <div className="flex gap-2 text-sm">
            <span>
              <span className="text-white/80">최고:</span>{' '}
              <span className="font-medium">{daily.maxDailyTemperature.toFixed(0)}°</span>
            </span>
            <span>
              <span className="text-white/80">최저:</span>{' '}
              <span className="font-medium">{daily.minDailyTemperature.toFixed(0)}°</span>
            </span>
          </div>
        ) : (
          <InlineMessage className="text-sm">제공된 최고/최저 기온 데이터가 없어요.</InlineMessage>
        )}
      </div>
      <HourlyForecastRow hourlyForecast={hourly} />
    </Card>
  );
};

export default WeatherInfo;
