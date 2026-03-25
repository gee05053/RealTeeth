import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import { PTY_LABEL, SKY_LABEL } from '@/entities/weather/lib/weatherLabels';
import useWeatherQuery from '@/entities/weather/model/queries';

type BookmarkCardProps = {
  bookmark: BookmarkType;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkAlias: (id: string, alias: string) => void;
};

const BookmarkCard = ({ bookmark, onRemoveBookmark, onUpdateBookmarkAlias }: BookmarkCardProps) => {
  const navigate = useNavigate();
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState(bookmark.alias);

  const { data: weather, isLoading } = useWeatherQuery(bookmark.nx, bookmark.ny);

  const handleSaveAlias = () => {
    const trimmed = aliasInput.trim();
    if (trimmed) onUpdateBookmarkAlias(bookmark.id, trimmed);
    setIsEditingAlias(false);
  };

  const conditionLabel = weather
    ? weather.currentWeather.precipitationType !== 0
      ? PTY_LABEL[weather.currentWeather.precipitationType]
      : SKY_LABEL[weather.currentWeather.sky ?? 1]
    : null;

  return (
    <div
      className="relative flex cursor-pointer flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
      onClick={() => navigate(`/bookmarks/${encodeURIComponent(bookmark.id)}`)}
    >
      <div className="flex items-start justify-between gap-1">
        {isEditingAlias ? (
          <div className="flex flex-1 items-center gap-3">
            <input
              type="text"
              className="w-full flex-1 rounded-lg bg-white/20 px-2 py-1 text-sm text-white outline-none"
              autoFocus
              value={aliasInput}
              onChange={e => setAliasInput(e.target.value)}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveAlias();
                if (e.key === 'Escape') setIsEditingAlias(false);
              }}
            />
            <div className="flex gap-3">
              <button
                className="flex-1 text-xs text-white/70 hover:text-white"
                onClick={e => {
                  e.stopPropagation();
                  handleSaveAlias();
                }}
              >
                저장
              </button>
              <button
                className="flex-1 text-xs text-white/40 hover:text-white/60"
                onClick={e => {
                  e.stopPropagation();
                  setAliasInput(bookmark.alias);
                  setIsEditingAlias(false);
                }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{bookmark.alias}</p>
            {bookmark.fullLabel && (
              <p className="mt-0.5 text-xs text-white/50">{bookmark.fullLabel}</p>
            )}
          </div>
        )}

        {!isEditingAlias && (
          <div className="flex shrink-0 items-center gap-3">
            <button
              className="text-xs text-white/40 hover:text-white/70"
              onClick={e => {
                e.stopPropagation();
                setIsEditingAlias(true);
              }}
            >
              ✎
            </button>
            <button
              className="text-base text-yellow-300"
              onClick={e => {
                e.stopPropagation();
                onRemoveBookmark(bookmark.id);
              }}
            >
              ★
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-xs text-white/50">날씨 불러오는 중...</p>
      ) : weather ? (
        <div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-white">
              {weather.currentWeather.temperature}°
            </span>
            <span className="mb-1 text-xs text-white/70">{conditionLabel}</span>
          </div>
          {weather.daily.minDailyTemperature !== null &&
          weather.daily.maxDailyTemperature !== null ? (
            <div className="mt-1 flex gap-3 text-xs text-white/70">
              <span>최저 {weather.daily.minDailyTemperature}°</span>
              <span>최고 {weather.daily.maxDailyTemperature}°</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default BookmarkCard;
