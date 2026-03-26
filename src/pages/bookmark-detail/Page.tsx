import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';

import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
import WeatherIcon from '@/entities/weather/ui/WeatherIcon';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
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
      <section className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{statusMessage}</p>
        </div>
      </section>
    );

  const { currentWeather, daily, hourly } = weather!;
  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer p-1 text-white/70 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <button
          className="cursor-pointer p-1 text-white/50 hover:text-white/80"
          onClick={handleRemove}
        >
          <TrashIcon className="size-5" />
        </button>
      </div>

      <>
        <section className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
          <div>
            <div className="flex items-start justify-between">
              {isEditingAlias ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-lg bg-white/20 px-3 py-1 text-sm text-white outline-none"
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
                <div className="flex flex-1 items-center gap-2">
                  <p className="text-base font-medium text-white">{bookmark!.alias}</p>
                  <button
                    className="cursor-pointer p-1 text-white/40 hover:text-white/70"
                    onClick={() => setIsEditingAlias(true)}
                  >
                    <PencilIcon className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-white/50">{bookmark!.fullLabel}</p>
            <div className="mt-4 flex items-end gap-4">
              <span className="text-7xl font-normal text-white">{currentWeather.temperature}°</span>
              <span className="mb-2 text-lg text-white/70">{conditionLabel}</span>
            </div>
            <div className="mt-4 text-sm">
              {daily.minDailyTemperature !== null && daily.maxDailyTemperature !== null ? (
                <div className="flex flex-wrap gap-x-4 text-white/70">
                  <span>
                    최저{' '}
                    <span className="font-normal text-white">{daily.minDailyTemperature}°</span>
                  </span>
                  <span>
                    최고{' '}
                    <span className="font-normal text-white">{daily.maxDailyTemperature}°</span>
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
      </>
    </PageContainer>
  );
};

export default BookmarkDetailPage;
