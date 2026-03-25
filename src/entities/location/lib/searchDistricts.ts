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

const searchDistricts = (inputSearchValue: string): SearchResultType[] => {
  const trimmedSearchValue = inputSearchValue.trim().split(' ').join('');

  if (!trimmedSearchValue) return [];

  return (districts as string[])
    .filter(raw => raw.split('-').join('').includes(trimmedSearchValue))
    .map(parseDistrict)
    .sort((a, b) => a.fullLabel.localeCompare(b.fullLabel, 'ko'));
};

export default searchDistricts;
