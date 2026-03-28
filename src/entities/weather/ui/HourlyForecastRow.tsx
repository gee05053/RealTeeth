import type { HourlyForecastType } from '@/entities/weather/model/types';
import WeatherIcon from '@/entities/weather/ui/WeatherIcon';

type HourlyForecastRowProps = {
  hourlyForecast: HourlyForecastType[];
};

const HourlyForecastRow = ({ hourlyForecast }: HourlyForecastRowProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto overscroll-x-contain py-2 sm:gap-3">
      {hourlyForecast.map(forecast => (
        <div
          key={`${forecast.fcstDate}_${forecast.fcstTime}`}
          className="flex min-w-12 flex-col items-center gap-1 text-white"
        >
          <span className="text-xs text-white/60">
            {forecast.fcstTime.slice(0, 2)}:{forecast.fcstTime.slice(2, 4)}
          </span>
          <WeatherIcon pty={forecast.pty} sky={forecast.sky ?? 1} className="text-xl" />
          <span className="text-base font-medium">{forecast.temperature.toFixed(0)}°</span>
        </div>
      ))}
    </div>
  );
};

export default HourlyForecastRow;
