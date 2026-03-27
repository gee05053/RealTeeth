import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import HourlyForecastRow from '@/entities/weather/ui/HourlyForecastRow';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';
import Card from '@/shared/ui/card/Card';
import PageContainer from '@/shared/ui/page-container/PageContainer';

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
        <p className="text-white/70">{statusMessage}</p>
      </Card>
    );

  const { currentWeather, daily, hourly } = weather!;
  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <IconButton className="size-10" onClick={() => navigate('/')}>
          <ArrowLeftIcon className="size-6" />
        </IconButton>
        <IconButton className="size-10" onClick={handleRemove}>
          <TrashIcon className="size-6 text-red-500/50 hover:text-red-500" />
        </IconButton>
      </div>

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
              <button
                className="cursor-pointer px-2 py-1 text-sm text-white/70 hover:text-white"
                onClick={handleSaveAlias}
              >
                저장
              </button>
              <button
                className="cursor-pointer px-2 py-1 text-sm text-white/50 hover:text-white/70"
                onClick={() => {
                  setAliasInput(bookmark!.alias);
                  setIsEditingAlias(false);
                }}
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="truncate">{bookmark!.alias}</p>
              <IconButton onClick={() => setIsEditingAlias(true)}>
                <PencilIcon className="size-4" />
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
            <span className="text-base text-white/90">{conditionLabel}</span>
          </div>
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
            <span className="text-sm text-white/70">제공된 최고/최저 기온 데이터가 없어요.</span>
          )}
        </div>
        <HourlyForecastRow hourlyForecast={hourly} />
      </Card>
    </PageContainer>
  );
};

export default BookmarkDetailPage;
