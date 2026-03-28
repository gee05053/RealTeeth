import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import getGeocodeToAddress from '@/entities/location/api/getGeocodeAddress';
import searchDistricts, { type SearchResultType } from '@/entities/location/lib/searchDistricts';
import type { GeocodedLocationType } from '@/entities/location/model/types';
import cn from '@/shared/lib/cn';

type LocationSearchProps = {
  onRequestSelectedLocation: (result: SearchResultType & Partial<GeocodedLocationType>) => void;
};

const LocationSearch = ({ onRequestSelectedLocation }: LocationSearchProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSearch = useRef(false);
  const searchResultButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastHandledKeydownEvent = useRef<{ key: string; timeStamp: number } | null>(null);

  const [inputSearchValue, setInputSearchValue] = useState('');
  const [focusedSearchResultIndex, setFocusedSearchResultIndex] = useState(-1);
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
      setFocusedSearchResultIndex(found.length > 0 ? 0 : -1);
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
        setFocusedSearchResultIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 포커스된 옵션 자동 스크롤
  useLayoutEffect(() => {
    if (focusedSearchResultIndex < 0 || !isOpenSearchResults) return;
    searchResultButtonRefs.current[focusedSearchResultIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusedSearchResultIndex, isOpenSearchResults]);

  const handleSelect = async (selectedResult: SearchResultType) => {
    skipNextSearch.current = true;
    setInputSearchValue(selectedResult.fullLabel);
    setIsOpenSearchResults(false);
    setIsGeocoding(true);

    const location = await getGeocodeToAddress(selectedResult.fullLabel);
    setIsGeocoding(false);
    onRequestSelectedLocation({ ...selectedResult, ...location });
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;

    if (e.key === 'Escape') {
      setIsOpenSearchResults(false);
      setFocusedSearchResultIndex(-1);
      return;
    }

    // 중복 이벤트 방지
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (
        lastHandledKeydownEvent.current?.key === e.key &&
        Math.abs(lastHandledKeydownEvent.current.timeStamp - e.timeStamp) < 1
      ) {
        e.preventDefault();
        return;
      }
      lastHandledKeydownEvent.current = { key: e.key, timeStamp: e.timeStamp };
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpenSearchResults(true);
      setFocusedSearchResultIndex(
        focusedSearchResultIndex < 0 ? 0 : (focusedSearchResultIndex + 1) % searchResults.length
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpenSearchResults(true);
      setFocusedSearchResultIndex(
        focusedSearchResultIndex <= 0 ? searchResults.length - 1 : focusedSearchResultIndex - 1
      );
      return;
    }

    if (e.key === 'Enter' && isOpenSearchResults && focusedSearchResultIndex >= 0) {
      e.preventDefault();
      handleSelect(searchResults[focusedSearchResultIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          className="peer w-full rounded-xl bg-white/20 py-2.5 pr-4 pl-11 placeholder-white/40 backdrop-blur-sm outline-none focus:bg-white/30 disabled:opacity-50 sm:py-3"
          inputMode="search"
          enterKeyHint="search"
          disabled={isGeocoding}
          placeholder="지역을 검색하세요"
          value={inputSearchValue}
          onChange={e => setInputSearchValue(e.target.value)}
          onFocus={() => setIsOpenSearchResults(searchResults.length > 0)}
          onKeyDown={handleInputKeyDown}
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/40 peer-disabled:opacity-50" />
      </div>
      {isOpenSearchResults && (
        <ul className="absolute top-full right-0 left-0 z-10 mt-1 max-h-[min(24rem,55vh)] overflow-auto rounded-xl bg-white/20 backdrop-blur-sm">
          {searchResults.length > 0 ? (
            searchResults.map((searchResult, index) => (
              <li key={searchResult.id}>
                <button
                  type="button"
                  ref={el => {
                    searchResultButtonRefs.current[index] = el;
                  }}
                  className={cn(
                    'flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left text-sm text-white hover:bg-white/20 sm:flex-row sm:items-center sm:gap-2 sm:px-4 sm:py-3',
                    focusedSearchResultIndex === index && 'bg-white/20'
                  )}
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
