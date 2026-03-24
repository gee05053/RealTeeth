import { useQuery } from '@tanstack/react-query';

import { fetchWeatherInfo } from '../api/weatherApi';

const useWeatherQuery = (nx?: number, ny?: number) => {
  return useQuery({
    queryKey: ['weather', nx, ny],
    queryFn: () => fetchWeatherInfo(nx!, ny!),
    enabled: nx !== undefined && ny !== undefined,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });
};

export default useWeatherQuery;
