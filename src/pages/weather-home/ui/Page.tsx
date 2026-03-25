import useRegionFromCoordQuery from '@/entities/location/model/queries';
import useWeatherQuery from '@/entities/weather/model/queries';
import useDetectLocation from '@/features/detect-location/hooks/useDetectLocation';
import PageContainer from '@/shared/ui/page-container/PageContainer';

const SKY_LABEL: Record<number, string> = { 1: '맑음', 3: '구름 많음', 4: '흐림' }; // 하늘 상태 라벨
const PTY_LABEL: Record<number, string> = { 0: '없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' }; // 강수형태 라벨

const WeatherHomePage = () => {
  const {
    location,
    isLoading: isLocating,
    errorMessage: locationErrorMessage,
  } = useDetectLocation();
  const { data: region } = useRegionFromCoordQuery(location?.latitude, location?.longitude);
  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherQuery(location?.nx, location?.ny);

  if (isLocating) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">위치를 감지하는 중...</p>
        </div>
      </PageContainer>
    );
  }

  if (locationErrorMessage) {
    return (
      <PageContainer>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white/70">{locationErrorMessage}</p>
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
          <p className="text-white/70">날씨 정보를 불러오지 못했습니다.</p>
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
      <section className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
        <p className="text-sm text-white/60">
          {region
            ? `${region.region1DepthName} ${region.region2DepthName} ${region.region3DepthName}`
            : '현재 위치'}
        </p>
        <div className="mt-2 flex flex-col gap-4">
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

      {/* 시간대별 기온 */}
      <section className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-medium text-white/60">시간대별 기온</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hourly.map(item => {
            const conditionLabel = item.pty !== 0 ? PTY_LABEL[item.pty] : SKY_LABEL[item.sky ?? 1];
            return (
              <div
                key={`${item.fcstDate}_${item.fcstTime}`}
                className="flex min-w-20 flex-col items-center gap-1 rounded-xl bg-white/10 px-2 py-3 text-white"
              >
                <span className="text-xs text-white/60">
                  {item.fcstTime.slice(0, 2)}:{item.fcstTime.slice(2, 4)}
                </span>
                <span className="text-xs text-white/60">{conditionLabel}</span>
                <span className="text-sm font-medium">{item.temperature}°</span>
              </div>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
};

export default WeatherHomePage;
