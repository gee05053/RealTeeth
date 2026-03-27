import type { CurrentWeatherType } from '@/entities/weather/model/types';

const SKY_LABEL: Record<number, string> = { 1: '맑음', 3: '구름 많음', 4: '흐림' }; // 하늘 상태 라벨
const PTY_LABEL: Record<number, string> = { 0: '없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' }; // 강수 형태 라벨

/** PTY가 있으면 강수 라벨, 없으면 하늘 상태 라벨 */
const getCurrentWeatherConditionLabel = (currentWeather: CurrentWeatherType): string =>
  currentWeather.precipitationType !== 0
    ? PTY_LABEL[currentWeather.precipitationType]
    : SKY_LABEL[currentWeather.sky ?? 1];

export { SKY_LABEL, PTY_LABEL, getCurrentWeatherConditionLabel };
