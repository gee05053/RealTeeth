import { useEffect, useState } from 'react';

import { arrayMove } from '@dnd-kit/sortable';

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

  const reorderBookmarks = (activeId: string, overId: string): void => {
    const oldIndex = bookmarks.findIndex(b => b.id === activeId);
    const newIndex = bookmarks.findIndex(b => b.id === overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
    saveBookmarks(arrayMove(bookmarks, oldIndex, newIndex));
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkAlias,
    reorderBookmarks,
  };
};

export default useBookmarks;
