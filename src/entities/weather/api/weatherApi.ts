import { env } from '@/shared/config/env';

import { formatDate, formatHour } from '../lib/formatDate';
import type {
  CurrentWeatherType,
  HourlyForecastType,
  NcstCategoryKeyType,
  WeatherInfoType,
} from '../model/types';

// 초단기실황: 정시 단위, 매시각 10분 이후 호출 가능
const getUltraSrtNcstBaseTime = (): { baseDate: string; baseTime: string } => {
  const now = new Date();
  let hours = now.getHours();

  if (now.getMinutes() < 10) {
    hours -= 1;
    if (hours < 0) {
      const yesterday = new Date(now.setDate(now.getDate() - 1));
      return { baseDate: formatDate(yesterday), baseTime: '2300' };
    }
  }

  return { baseDate: formatDate(now), baseTime: formatHour(hours) };
};

// 당일 최저/최고 기온 전용: TMN은 0200에만 발표되므로 오늘 0200 고정 사용
// 02:10 이전이면 아직 오늘 0200이 발표 전이므로 어제 2300 사용
const getDailyTempBaseTime = (): { baseDate: string; baseTime: string } => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes >= 2 * 60 + 10) return { baseDate: formatDate(now), baseTime: '0200' };

  const yesterday = new Date(now.setDate(now.getDate() - 1));
  return { baseDate: formatDate(yesterday), baseTime: '2300' };
};

// 단기예보: 0200/0500/0800/1100/1400/1700/2000/2300, 각 +10분 후 발표
const getVilageFcstBaseTime = (): { baseDate: string; baseTime: string } => {
  const now = new Date();
  const baseHours = [23, 20, 17, 14, 11, 8, 5, 2];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const h of baseHours) {
    if (currentMinutes >= h * 60 + 10) {
      return { baseDate: formatDate(now), baseTime: formatHour(h) };
    }
  }

  const yesterday = new Date(now.setDate(now.getDate() - 1));
  return { baseDate: formatDate(yesterday), baseTime: '2300' };
};

interface KmaItem {
  category: string;
  fcstDate?: string;
  fcstTime?: string;
  fcstValue?: string;
  obsrValue?: string;
}

interface KmaResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: { items: { item: KmaItem[] } };
  };
}

const fetchKmaData = async (
  endpoint: string,
  params: Record<string, string>
): Promise<KmaItem[]> => {
  const queryString = new URLSearchParams({
    serviceKey: env.WEATHER_API_KEY,
    dataType: 'JSON',
    ...params,
  });

  const res = await fetch(
    `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${endpoint}?${queryString.toString()}`
  );

  if (!res.ok) throw new Error(`기상청 API 오류: ${res.status}`);

  const data: KmaResponse = await res.json();
  if (data.response.header.resultCode !== '00') {
    // 00 이외는 에러 코드
    throw new Error(`기상청 API 오류: ${data.response.header.resultMsg}`);
  }

  return data.response.body.items.item;
};

const fetchWeatherInfo = async (nx: number, ny: number): Promise<WeatherInfoType> => {
  const { baseDate: ncstDate, baseTime: ncstTime } = getUltraSrtNcstBaseTime();
  const { baseDate: fcstDate, baseTime: fcstTime } = getVilageFcstBaseTime();
  const { baseDate: dailyDate, baseTime: dailyTime } = getDailyTempBaseTime();

  const [ncstItems, fcstItems, dailyItems] = await Promise.all([
    fetchKmaData('getUltraSrtNcst', {
      base_date: ncstDate,
      base_time: ncstTime,
      nx: String(nx),
      ny: String(ny),
      numOfRows: '8', //총 8개 데이터
      pageNo: '1',
    }),
    fetchKmaData('getVilageFcst', {
      base_date: fcstDate,
      base_time: fcstTime,
      nx: String(nx),
      ny: String(ny),
      numOfRows: '336', //최대 1시간에 14개 데이터, 24시간 예보 데이터가 필요하므로 24 * 14 = 336개
      pageNo: '1',
    }),
    fetchKmaData('getVilageFcst', {
      base_date: dailyDate,
      base_time: dailyTime,
      nx: String(nx),
      ny: String(ny),
      numOfRows: '336',
      pageNo: '1',
    }),
  ]);

  // 초단기실황 파싱 (현재 날씨)
  const ncstMap = new Map<NcstCategoryKeyType, string>(
    ncstItems.map(item => [item.category as NcstCategoryKeyType, item.obsrValue ?? '0'])
  );
  const currentWeather: CurrentWeatherType = {
    temperature: parseFloat(ncstMap.get('T1H') ?? '0'),
    sky: 1, // 하늘 상태 기본값 맑음
    precipitationType: parseInt(ncstMap.get('PTY') ?? '0'),
  };

  // 단기예보 파싱 (최저/최고 기온 + 시간별 기온)
  const now = new Date();
  const today = formatDate(now);
  const todayHour = formatHour(now.getHours());

  // 당일 최저/최고 기온: 이른 발표시각 응답에서 오늘 날짜의 TMN/TMX 추출
  let minDailyTemperature: number | null = null;
  let maxDailyTemperature: number | null = null;

  for (const item of dailyItems) {
    if (item.fcstDate === today && item.fcstValue) {
      if (item.category === 'TMN') minDailyTemperature = parseFloat(item.fcstValue);
      if (item.category === 'TMX') maxDailyTemperature = parseFloat(item.fcstValue);
    }
  }

  const hourlyMap = new Map<string, Partial<HourlyForecastType>>();

  for (const item of fcstItems) {
    if (!item.fcstDate || !item.fcstTime || !item.fcstValue) continue;
    const key = `${item.fcstDate}_${item.fcstTime}`;

    if (item.fcstDate === today && item.fcstTime === todayHour && item.category === 'SKY')
      currentWeather.sky = parseInt(item.fcstValue);

    if (!hourlyMap.has(key)) {
      hourlyMap.set(key, { fcstDate: item.fcstDate, fcstTime: item.fcstTime });
    }

    const entry = hourlyMap.get(key)!;
    switch (item.category) {
      case 'TMP': // 기온
        entry.temperature = parseFloat(item.fcstValue);
        break;
      case 'SKY': // 하늘 상태
        entry.sky = parseInt(item.fcstValue);
        break;
      case 'PTY': // 강수형태
        entry.pty = parseInt(item.fcstValue);
        break;
      case 'POP': // 강수확률
        entry.pop = parseInt(item.fcstValue);
        break;
    }
  }

  // 내일 날짜의 (현재 시각 - 1시간) 정시를 끝으로, 역으로 24개 정시 슬롯만 사용
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const endSlot = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    oneHourAgo.getHours(),
    0,
    0,
    0
  );
  const startSlot = new Date(endSlot.getTime() - 23 * 60 * 60 * 1000);
  const allowedHourlyKeys = new Set<string>();
  for (let i = 1; i < 25; i++) {
    const t = new Date(startSlot.getTime() + i * 60 * 60 * 1000);
    allowedHourlyKeys.add(`${formatDate(t)}_${formatHour(t.getHours())}`);
  }

  const hourly: HourlyForecastType[] = [...hourlyMap.values()]
    .filter((entry): entry is HourlyForecastType =>
      allowedHourlyKeys.has(`${entry.fcstDate}_${entry.fcstTime}`)
    )
    .sort((a, b) => `${a.fcstDate}_${a.fcstTime}`.localeCompare(`${b.fcstDate}_${b.fcstTime}`));

  return {
    currentWeather,
    daily: { minDailyTemperature, maxDailyTemperature },
    hourly,
  };
};

export { fetchWeatherInfo };
