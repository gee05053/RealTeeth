import { type GeocodedLocationType } from '@/entities/location/model/types';
import { latLonToGrid } from '@/entities/location/lib/convertToGrid';
import { env } from '@/shared/config/env';

type KakaoAddressDoc = {
  address_name: string; // 전체 주소, 입력에 따라 결정
  address_type: 'REGION' | 'ROAD' | 'REGION_ROAD' | 'ROAD_ADDR'; // address_name의 타입
  road_address?: null; // 도로명 주소 상세 정보
  x: string; // 경도
  y: string; // 위도
};

type KakaoAddressResponse = {
  documents?: KakaoAddressDoc[];
  meta: {
    total_count: number; // 전체 검색 결과 수
    pageable_count: number; // total_count 중 노출 가능 문서 수
    is_end: boolean; // 현재 페이지가 마지막 페이지인지 여부
  };
};

const getGeocodeToAddress = async (query: string): Promise<GeocodedLocationType | null> => {
  const url = new URL('https://dapi.kakao.com/v2/local/search/address');
  url.searchParams.set('query', query);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY}` },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as KakaoAddressResponse;
  const doc = data.documents?.[0];
  if (!doc) return null;

  const latitude = parseFloat(doc.y);
  const longitude = parseFloat(doc.x);
  const { nx, ny } = latLonToGrid(latitude, longitude);

  return { latitude, longitude, nx, ny };
};

export default getGeocodeToAddress;
