import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import type { DetectedLocationType } from '@/entities/location/model/types';
import { getCurrentWeatherConditionLabel } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import DailyMinMaxTemperature from '@/entities/weather/ui/DailyMinMaxTemperature';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

import HourlyForecastRow from './HourlyForecastRow';

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
    <Card className="relative" classNames={{ content: 'flex flex-col gap-3 sm:gap-4' }}>
      <IconButton
        className="absolute top-3 right-3 size-9 sm:top-4 sm:right-4 sm:size-10"
        onClick={handleBookmarkToggle}
      >
        {isBookmarked ? (
          <BookmarkSolidIcon className="size-5 text-yellow-300 sm:size-6" />
        ) : (
          <BookmarkOutlineIcon className="size-5 sm:size-6" />
        )}
      </IconButton>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center font-medium sm:text-lg">{locationLabel}</p>
        <span className="relative text-4xl sm:text-5xl">
          {currentWeather.temperature.toFixed(0)}
          <span className="absolute text-xl sm:text-2xl">°</span>
        </span>
        <span className="text-center text-sm text-white/90 sm:text-base">
          {getCurrentWeatherConditionLabel(currentWeather)}
        </span>
        <DailyMinMaxTemperature daily={daily} />
      </div>
      <HourlyForecastRow hourlyForecast={hourly} />
    </Card>
  );
};

export default WeatherInfo;
