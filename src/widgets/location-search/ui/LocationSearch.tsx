import { useEffect, useRef, useState } from 'react';

import getGeocodeToAddress, {
  type GeocodedLocationType,
} from '@/entities/location/api/getGeocodeAddress';
import searchDistricts, { type SearchResultType } from '@/entities/location/lib/searchDistricts';

type LocationSearchProps = {
  onRequestSelectedLocation: (result: SearchResultType, location: GeocodedLocationType | null) => void;
};

const LocationSearch = ({ onRequestSelectedLocation }: LocationSearchProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSearch = useRef(false);

  const [inputSearchValue, setInputSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [isOpenSearchResults, setIsOpenSearchResults] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // debounce 검색
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (skipNextSearch.current) {
        skipNextSearch.current = false;
        return;
      }
      const found = searchDistricts(inputSearchValue);
      setSearchResults(found);
      setIsOpenSearchResults(found.length > 0);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputSearchValue]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (selectedResult: SearchResultType) => {
    skipNextSearch.current = true;
    setInputSearchValue(selectedResult.fullLabel);
    setIsOpenSearchResults(false);
    setIsGeocoding(true);

    const location = await getGeocodeToAddress(selectedResult.fullLabel);
    setIsGeocoding(false);
    onRequestSelectedLocation(selectedResult, location);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputSearchValue}
        onChange={e => setInputSearchValue(e.target.value)}
        onFocus={() => setIsOpenSearchResults(true)}
        placeholder="지역을 검색하세요"
        disabled={isGeocoding}
        className="w-full rounded-xl bg-white/20 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm outline-none focus:bg-white/30 disabled:opacity-50"
      />
      {isOpenSearchResults && (
        <ul className="absolute top-full right-0 left-0 z-10 mt-1 h-96 overflow-auto rounded-xl bg-white/20 backdrop-blur-sm">
          {searchResults.length > 0 ? (
            searchResults.map(searchResult => (
              <li key={searchResult.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/20"
                  onClick={() => handleSelect(searchResult)}
                >
                  <span className="font-medium">{searchResult.label}</span>
                  <span className="text-white/60">{searchResult.fullLabel}</span>
                </button>
              </li>
            ))
          ) : (
            <li>
              <span className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm text-white">
                검색 결과가 없습니다.
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
