// 초단기실황 category 키
export type NcstCategoryKeyType =
  | 'T1H' // 기온 (°C)
  | 'RN1' // 1시간 강수량 (mm)
  | 'UUU' // 동서바람성분 (m/s)
  | 'VVV' // 남북바람성분 (m/s)
  | 'REH' // 습도 (%)
  | 'PTY' // 강수형태 (0:없음 1:비 2:비/눈 3:눈 4:소나기)
  | 'VEC' // 풍향 (deg)
  | 'WSD'; // 풍속 (m/s)

export type CurrentWeatherType = {
  temperature: number; // T1H: 현재 기온
  sky: number; // SKY: 하늘 상태
  precipitationType: number; // PTY: 강수형태 (0:없음 1:비 2:비/눈 3:눈 4:소나기)
};

export type DailyTemperatureType = {
  minDailyTemperature: number | null; // TMN: 일 최저기온
  maxDailyTemperature: number | null; // TMX: 일 최고기온
};

export type HourlyForecastType = {
  fcstDate: string; // YYYYMMDD
  fcstTime: string; // HHmm
  temperature: number; // TMP
  sky: number; // SKY: 하늘 상태
  pty: number; // PTY: 강수 형태
  pop: number; // POP: 강수 확률
};

export type WeatherInfoType = {
  currentWeather: CurrentWeatherType;
  daily: DailyTemperatureType;
  hourly: HourlyForecastType[];
};
