import { env } from '@/shared/config/env';

export type RegionFromCoordType = {
  addressName: string;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
};

type KakaoCoord2AddressDoc = {
  region_type: 'B' | 'H';
  code: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
};

type KakaoCoord2AddressResponse = {
  documents?: KakaoCoord2AddressDoc[];
  meta: { total_count: number };
};

const fetchRegionFromCoord = async (
  latitude: number,
  longitude: number
): Promise<RegionFromCoordType | null> => {
  const url = new URL('https://dapi.kakao.com/v2/local/geo/coord2regioncode');
  url.searchParams.set('x', String(longitude));
  url.searchParams.set('y', String(latitude));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as KakaoCoord2AddressResponse;
  const region = data.documents?.find(doc => doc.region_type === 'B');
  if (!region) return null;

  return {
    addressName: region.address_name,
    region1DepthName: region.region_1depth_name,
    region2DepthName: region.region_2depth_name,
    region3DepthName: region.region_3depth_name,
  };
};

export { fetchRegionFromCoord };
