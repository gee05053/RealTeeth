import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeftIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { getCurrentWeatherConditionLabel } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import DailyMinMaxTemperature from '@/entities/weather/ui/DailyMinMaxTemperature';
import HourlyForecastRow from '@/entities/weather/ui/HourlyForecastRow';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

const BookmarkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookmarks, removeBookmark, updateBookmarkAlias } = useBookmarks();

  const bookmark = bookmarks.find(b => b.id === decodeURIComponent(id ?? ''));

  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState(bookmark?.alias ?? '');

  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherQuery(bookmark?.nx, bookmark?.ny);

  const handleSaveAlias = () => {
    if (!bookmark) return;
    const trimmed = aliasInput.trim();
    if (trimmed) updateBookmarkAlias(bookmark.id, trimmed);
    setIsEditingAlias(false);
  };

  const handleRemove = () => {
    if (!bookmark) return;
    removeBookmark(bookmark.id);
    navigate('/');
  };

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

  const { currentWeather, daily, hourly } = weather!;

  return (
    <>
      <IconButton className="size-10" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="size-6" />
      </IconButton>

      <Card
        className="relative"
        classNames={{ content: 'flex flex-col gap-4' }}
        title={
          isEditingAlias ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg bg-white/20 px-3 py-1 text-lg outline-none"
                autoFocus
                value={aliasInput}
                onChange={e => setAliasInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveAlias()}
              />
              <IconButton onClick={handleSaveAlias}>
                <CheckIcon className="size-4" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setAliasInput(bookmark!.alias);
                  setIsEditingAlias(false);
                }}
              >
                <XMarkIcon className="size-4" />
              </IconButton>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="truncate">{bookmark!.alias}</p>
                <IconButton onClick={() => setIsEditingAlias(true)}>
                  <PencilIcon className="size-4" />
                </IconButton>
              </div>
              <IconButton
                className="size-10 text-red-200 hover:bg-red-500/20 hover:text-red-50 active:bg-red-500/30"
                onClick={handleRemove}
              >
                <TrashIcon className="size-6" />
              </IconButton>
            </div>
          )
        }
        description={bookmark!.fullLabel}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-4">
            <span className="relative text-5xl">
              {currentWeather.temperature.toFixed(0)}
              <span className="absolute text-2xl">°</span>
            </span>
            <span className="text-base text-white/90">
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
