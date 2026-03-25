import districts from '../data/korea_districts.json';

export type SearchResultType = {
  id: string;
  label: string; // 표시용 e.g. "중동"
  fullLabel: string; // 전체 표시용 e.g. "경기도 부천시 원미구 중동"
};

const parseDistrict = (raw: string): SearchResultType => {
  const parts = raw.split('-');
  return {
    id: raw,
    label: parts[parts.length - 1],
    fullLabel: parts.join(' '),
  };
};

// 정확도 점수: 세그먼트 완전 일치(2) > 부분 포함(1)
const getRelevanceScore = (raw: string, query: string): number => {
  for (const segment of raw.split('-')) {
    if (segment === query) return 2;
  }
  return 1;
};

const searchDistricts = (inputSearchValue: string): SearchResultType[] => {
  const trimmedSearchValue = inputSearchValue.trim().split(' ').join('');

  if (!trimmedSearchValue) return [];

  return (districts as string[])
    .filter(raw => raw.split('-').join('').includes(trimmedSearchValue))
    .map(raw => ({ result: parseDistrict(raw), score: getRelevanceScore(raw, trimmedSearchValue) }))
    .sort((a, b) => b.score - a.score || a.result.fullLabel.localeCompare(b.result.fullLabel, 'ko'))
    .map(({ result }) => result);
};

export default searchDistricts;
