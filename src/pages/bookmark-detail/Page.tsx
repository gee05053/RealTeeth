import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { getCurrentWeatherConditionLabel } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import DailyMinMaxTemperature from '@/entities/weather/ui/DailyMinMaxTemperature';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';
import HourlyForecastRow from '@/widgets/weather/HourlyForecastRow';

import BookmarkDetailCardTitle from './BookmarkDetailTitle';

const BookmarkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const bookmark = bookmarks.find(b => b.id === decodeURIComponent(id ?? ''));

  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherQuery(bookmark?.nx, bookmark?.ny);

  const statusMessage = !bookmark
    ? '북마크를 찾을 수 없습니다.'
    : isWeatherLoading
      ? '날씨 정보를 불러오는 중...'
      : weatherError || !weather
        ? '날씨 정보를 불러올 수 없습니다.'
        : null;

  if (statusMessage)
    return (
      <Card classNames={{ content: 'flex justify-center' }}>
        <InlineMessage>{statusMessage}</InlineMessage>
      </Card>
    );

  if (!bookmark) return null;

  const { currentWeather, daily, hourly } = weather!;

  return (
    <>
      <IconButton className="size-9 sm:size-10" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="size-5 sm:size-6" />
      </IconButton>

      <Card
        className="relative"
        classNames={{ content: 'flex flex-col gap-3 sm:gap-4' }}
        title={<BookmarkDetailCardTitle bookmark={bookmark} />}
        description={bookmark.fullLabel}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-3 sm:gap-4">
            <span className="relative text-4xl sm:text-5xl">
              {currentWeather.temperature.toFixed(0)}
              <span className="absolute text-xl sm:text-2xl">°</span>
            </span>
            <span className="text-sm text-white/90 sm:text-base">
              {getCurrentWeatherConditionLabel(currentWeather)}
            </span>
          </div>
          <DailyMinMaxTemperature daily={daily} />
        </div>
        <HourlyForecastRow hourlyForecast={hourly} />
      </Card>
    </>
  );
};

export default BookmarkDetailPage;
