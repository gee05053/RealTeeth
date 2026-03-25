import { useEffect, useState } from 'react';

import type { BookmarkType } from '@/entities/bookmark/model/types';

const STORAGE_KEY = 'bookmarks';
const MAX_BOOKMARKS = 6;
const BOOKMARKS_CHANGE_EVENT = 'bookmarksChange';

const getBookmarks = (): BookmarkType[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookmarkType[]) : [];
  } catch {
    return [];
  }
};

const saveBookmarks = (bookmarks: BookmarkType[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event(BOOKMARKS_CHANGE_EVENT));
};

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(getBookmarks);

  useEffect(() => {
    const handleChange = () => setBookmarks(getBookmarks());
    window.addEventListener(BOOKMARKS_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(BOOKMARKS_CHANGE_EVENT, handleChange);
  }, []);

  const addBookmark = (newBookmark: BookmarkType) => {
    if (bookmarks.length >= MAX_BOOKMARKS) {
      alert(`북마크는 최대 ${MAX_BOOKMARKS}개까지 추가할 수 있어요.`);
    } else {
      saveBookmarks([...bookmarks, newBookmark]);
    }
  };

  const removeBookmark = (targetId: string): void => {
    saveBookmarks(bookmarks.filter(bookmark => bookmark.id !== targetId));
  };

  const updateBookmarkAlias = (targetId: string, updatedAlias: string): void => {
    saveBookmarks(
      bookmarks.map(bookmark =>
        bookmark.id === targetId ? { ...bookmark, alias: updatedAlias } : bookmark
      )
    );
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkAlias,
  };
};

export default useBookmarks;
