import { type KeyboardEvent, useState } from 'react';

import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';

type BookmarkCardHeaderProps = {
  bookmark: BookmarkType;
};

const BookmarkCardHeader = ({ bookmark }: BookmarkCardHeaderProps) => {
  const { removeBookmark, updateBookmarkAlias } = useBookmarks();

  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInputValue, setAliasInputValue] = useState('');

  const handleStartEditAlias = () => {
    setAliasInputValue(bookmark.alias);
    setIsEditingAlias(true);
  };

  const handleSaveAlias = () => {
    const trimmed = aliasInputValue.trim();
    if (trimmed) updateBookmarkAlias(bookmark.id, trimmed);
    setIsEditingAlias(false);
  };

  const handleCancelEditAlias = () => {
    setAliasInputValue(bookmark.alias);
    setIsEditingAlias(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveAlias();
    if (e.key === 'Escape') handleCancelEditAlias();
  };

  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-3">
      {isEditingAlias ? (
        <input
          type="text"
          className="min-w-0 flex-1 rounded-lg bg-white/20 px-2 py-1 text-sm outline-none"
          autoFocus
          value={aliasInputValue}
          onChange={e => setAliasInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="truncate">{bookmark.alias}</span>
      )}
      <span className="flex shrink-0 items-center gap-1.5">
        {isEditingAlias ? (
          <>
            <IconButton onClick={handleSaveAlias}>
              <CheckIcon className="size-4" />
            </IconButton>
            <IconButton onClick={handleCancelEditAlias}>
              <XMarkIcon className="size-4" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={handleStartEditAlias}>
              <PencilIcon className="size-4" />
            </IconButton>
            <IconButton
              className="text-red-200 hover:bg-red-500/20 hover:text-red-50 active:bg-red-500/30"
              onClick={() => removeBookmark(bookmark.id)}
            >
              <TrashIcon className="size-4" />
            </IconButton>
          </>
        )}
      </span>
    </span>
  );
};

export default BookmarkCardHeader;
