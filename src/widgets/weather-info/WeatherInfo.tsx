import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import WeatherIcon from '@/entities/weather/ui/WeatherIcon';
import useWeatherQuery from '@/entities/weather/model/queries';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import type { DetectedLocationType } from '@/features/detect-location/hooks/useDetectLocation';

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
      <section className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{weatherStatusMessage}</p>
        </div>
      </section>
    );

  const { currentWeather, daily, hourly } = weather!;

  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
      <div>
        <div className="flex items-start justify-between">
          <p className="text-base text-white/60">{locationLabel}</p>
          <button className="cursor-pointer p-1" onClick={handleBookmarkToggle}>
            {isBookmarked ? (
              <BookmarkSolidIcon className="size-7 text-yellow-300" />
            ) : (
              <BookmarkOutlineIcon className="size-7 text-white/60" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-end gap-4">
          <span className="text-7xl font-normal text-white">{currentWeather.temperature}°</span>
          <span className="text-lg text-white/70">{conditionLabel}</span>
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
            <span className="text-white/70">제공된 최고/최저 기온 데이터가 없어요.</span>
          )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {hourly.map(item => (
          <div
            key={`${item.fcstDate}_${item.fcstTime}`}
            className="flex min-w-20 flex-col items-center gap-1 rounded-xl bg-white/10 px-2 py-3 text-white"
          >
            <span className="text-xs text-white/60">
              {item.fcstTime.slice(0, 2)}:{item.fcstTime.slice(2, 4)}
            </span>
            <WeatherIcon pty={item.pty} sky={item.sky ?? 1} className="text-xl" />
            <span className="text-sm font-medium">{item.temperature}°</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherInfo;
