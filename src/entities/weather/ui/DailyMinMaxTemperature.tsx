import type { DailyTemperatureType } from '@/entities/weather/model/types';
import cn from '@/shared/lib/cn';
import InlineStatusMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

type DailyMinMaxTemperatureProps = {
  daily: DailyTemperatureType;
  className?: string;
};

const DailyMinMaxTemperature = ({ daily, className }: DailyMinMaxTemperatureProps) => {
  const maxTemperature = daily.maxDailyTemperature;
  const minTemperature = daily.minDailyTemperature;

  return (
    <div className={cn('flex gap-2 text-sm', className)}>
      {maxTemperature && minTemperature ? (
        <>
          <span>
            <span className="text-white/80">최고:</span>{' '}
            <span className="font-medium">{maxTemperature.toFixed(0)}°</span>
          </span>
          <span>
            <span className="text-white/80">최저:</span>{' '}
            <span className="font-medium">{minTemperature.toFixed(0)}°</span>
          </span>
        </>
      ) : (
        <InlineStatusMessage>제공된 최고/최저 기온 데이터가 없어요.</InlineStatusMessage>
      )}
    </div>
  );
};

export default DailyMinMaxTemperature;
