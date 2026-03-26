import cn from '@/shared/lib/cn';

type WeatherIconProps = {
  pty: number;
  sky?: number;
  className?: string;
};

// PTY: 0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기
// SKY: 1=맑음, 3=구름 많음, 4=흐림
const WEATHER_EMOJI: Record<string, string> = {
  pty_1: '🌧',
  pty_2: '🌨',
  pty_3: '❄️',
  pty_4: '🌦',
  sky_1: '☀️',
  sky_3: '🌤',
  sky_4: '☁️',
};

const WeatherIcon = ({ pty, sky = 1, className }: WeatherIconProps) => {
  const emoji = pty !== 0 ? WEATHER_EMOJI[`pty_${pty}`] : (WEATHER_EMOJI[`sky_${sky}`] ?? '☀️');

  return <span className={cn('leading-none', className)}>{emoji}</span>;
};

export default WeatherIcon;
