import type { BookmarkType } from '@/entities/bookmark/model/types';
import type { GeocodedLocationType } from '@/entities/location/api/getGeocodeAddress';
import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import type { WeatherInfoType } from '@/entities/weather/model/types';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';

type WeatherInfoProps = {
  weather: WeatherInfoType;
  locationLabel: string;
  activeLocation: GeocodedLocationType;
};

const WeatherInfo = ({ weather, locationLabel, activeLocation }: WeatherInfoProps) => {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { currentWeather, daily, hourly } = weather;

  const bookmarkTarget: BookmarkType = {
    // 검색 위치는 지역 문자열(안정적), 감지 위치는 region 이름(GPS 오차 없음)
    id: locationLabel,
    alias: locationLabel,
    label: locationLabel,
    fullLabel: locationLabel,
    latitude: activeLocation.latitude,
    longitude: activeLocation.longitude,
    nx: activeLocation.nx,
    ny: activeLocation.ny,
  };

  const bookmarked = bookmarks.some(b => b.id === bookmarkTarget.id);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(bookmarkTarget.id);
    } else {
      addBookmark(bookmarkTarget);
    }
  };

  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
      <div>
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
      </div>

      <div>
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
      </div>
    </section>
  );
};

export default WeatherInfo;
