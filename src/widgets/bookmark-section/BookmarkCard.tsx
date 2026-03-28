import type { PointerEvent } from 'react';

import { Link } from 'react-router-dom';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import useWeatherQuery from '@/entities/weather/model/queries';
import DailyMinMaxTemperature from '@/entities/weather/ui/DailyMinMaxTemperature';
import WeatherIcon from '@/entities/weather/ui/WeatherIcon';
import cn from '@/shared/lib/cn';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

import BookmarkCardHeader from './BookmarkCardHeader';

type BookmarkCardProps = {
  bookmark: BookmarkType;
};

const stopSortablePointer = (e: PointerEvent) => {
  e.stopPropagation();
};

const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const { data: weather, isLoading } = useWeatherQuery(bookmark.nx, bookmark.ny);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bookmark.id,
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={cn(
        'h-full touch-manipulation',
        isDragging ? 'z-10 opacity-[0.92]' : 'cursor-grab active:cursor-grabbing'
      )}
      {...attributes}
      {...listeners}
    >
      <Card
        className="relative border border-white/40 bg-transparent p-3 shadow-sm sm:p-4 sm:shadow-md"
        classNames={{
          header: 'border-b border-white/40 pb-3',
          title: 'block text-sm sm:text-base',
          description: 'block text-xs leading-snug text-white/65 sm:text-sm',
        }}
        title={<BookmarkCardHeader bookmark={bookmark} />}
        description={bookmark.fullLabel}
        footer={
          <div onPointerDown={stopSortablePointer}>
            <Link
              className="flex items-center justify-end gap-0.5 text-xs text-white/80 hover:text-white hover:underline hover:underline-offset-4"
              to={`/bookmarks/${encodeURIComponent(bookmark.id)}`}
            >
              <span>상세 보기</span>
              <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
            </Link>
          </div>
        }
      >
        {isLoading ? (
          <InlineMessage className="text-xs">날씨 불러오는 중...</InlineMessage>
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
            <DailyMinMaxTemperature className="text-xs" daily={weather.daily} />
          </div>
        ) : (
          <InlineMessage className="text-xs">날씨 정보를 불러올 수 없어요.</InlineMessage>
        )}
      </Card>
    </div>
  );
};

export default BookmarkCard;
