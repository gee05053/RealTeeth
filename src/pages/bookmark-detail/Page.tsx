import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';
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

  if (!bookmark) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">북마크를 찾을 수 없습니다.</p>
        </div>
      </PageContainer>
    );
  }

  if (isWeatherLoading) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">날씨 정보를 불러오는 중...</p>
        </div>
      </PageContainer>
    );
  }

  if (weatherError || !weather) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">날씨 정보를 불러올 수 없습니다.</p>
        </div>
      </PageContainer>
    );
  }

  const { currentWeather, daily, hourly } = weather;
  const conditionLabel =
    currentWeather.precipitationType !== 0
      ? PTY_LABEL[currentWeather.precipitationType]
      : SKY_LABEL[currentWeather.sky ?? 1];

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-white/70 hover:text-white"
        >
          ← 뒤로
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm text-white/50 hover:text-white/80"
        >
          북마크 삭제
        </button>
      </div>

      <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          {isEditingAlias ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                type="text"
                value={aliasInput}
                onChange={e => setAliasInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveAlias()}
                className="flex-1 rounded-lg bg-white/20 px-3 py-1 text-sm text-white outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveAlias}
                className="text-sm text-white/70 hover:text-white"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => {
                  setAliasInput(bookmark.alias);
                  setIsEditingAlias(false);
                }}
                className="text-sm text-white/50 hover:text-white/70"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="flex flex-1 items-center gap-2">
              <p className="text-sm font-medium text-white">{bookmark.alias}</p>
              <button
                type="button"
                onClick={() => setIsEditingAlias(true)}
                className="text-xs text-white/40 hover:text-white/70"
              >
                수정
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-white/50">{bookmark.fullLabel}</p>
        <div className="mt-4 flex flex-col gap-4">
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
    </PageContainer>
  );
};

export default BookmarkDetailPage;
