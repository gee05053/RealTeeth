import { useQuery } from '@tanstack/react-query';

import { fetchRegionFromCoord } from '../api/coordToAddress';

const useRegionFromCoordQuery = (latitude?: number, longitude?: number) => {
  return useQuery({
    queryKey: ['region', latitude, longitude],
    queryFn: () => fetchRegionFromCoord(latitude!, longitude!),
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: Infinity,
  });
};

export default useRegionFromCoordQuery;
