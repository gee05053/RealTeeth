import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PencilIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import useWeatherQuery from '@/entities/weather/model/queries';
import WeatherIcon from '@/entities/weather/ui/WeatherIcon';
import Card from '@/shared/ui/card/Card';

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

  return (
    <Card
      className="relative border border-white/40 bg-transparent p-3"
      classNames={{
        header: 'border-b border-white/40 pb-3',
        title: 'text-sm',
        description: 'text-xs',
      }}
      title={
        <div className="flex items-center justify-between gap-2">
          {isEditingAlias ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                className="w-full flex-1 rounded-lg bg-white/20 px-2 py-1 text-sm outline-none"
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
                  className="flex-1 cursor-pointer px-2 py-1 text-xs text-white/70 hover:text-white"
                  onClick={e => {
                    e.stopPropagation();
                    handleSaveAlias();
                  }}
                >
                  저장
                </button>
                <button
                  className="flex-1 cursor-pointer px-2 py-1 text-xs text-white/40 hover:text-white/60"
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
            <p className="truncate">{bookmark.alias}</p>
          )}
          <div className="flex shrink-0 items-center gap-1">
            {!isEditingAlias && (
              <button
                className="cursor-pointer p-1"
                onClick={e => {
                  e.stopPropagation();
                  setIsEditingAlias(true);
                }}
              >
                <PencilIcon className="size-3.5 text-white/40 hover:text-white/70" />
              </button>
            )}
            <button
              className="cursor-pointer p-1"
              onClick={e => {
                e.stopPropagation();
                onRemoveBookmark(bookmark.id);
              }}
            >
              <BookmarkSolidIcon className="size-3.5 text-yellow-300" />
            </button>
          </div>
        </div>
      }
      description={bookmark.fullLabel}
      onClick={() => navigate(`/bookmarks/${encodeURIComponent(bookmark.id)}`)}
    >
      {isLoading ? (
        <p className="text-xs text-white/70">날씨 불러오는 중...</p>
      ) : weather ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <span className="relative text-3xl">
              {weather.currentWeather.temperature.toFixed(0)}
              <span className="absolute text-xl">°</span>
            </span>
            <WeatherIcon
              className="text-xl"
              pty={weather.currentWeather.precipitationType}
              sky={weather.currentWeather.sky ?? 1}
            />
          </div>
          {weather.daily.minDailyTemperature !== null &&
          weather.daily.maxDailyTemperature !== null ? (
            <div className="flex gap-2 text-xs">
              <span>
                <span className="text-white/80">최고:</span>{' '}
                <span className="font-medium">{weather.daily.maxDailyTemperature.toFixed(0)}°</span>
              </span>
              <span>
                <span className="text-white/80">최저:</span>{' '}
                <span className="font-medium">{weather.daily.minDailyTemperature.toFixed(0)}°</span>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
};

export default BookmarkCard;
