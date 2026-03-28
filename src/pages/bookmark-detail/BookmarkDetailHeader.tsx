import { type KeyboardEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import type { BookmarkType } from '@/entities/bookmark/model/types';
import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import IconButton from '@/shared/ui/button/IconButton';

type BookmarkDetailCardTitleProps = {
  bookmark: BookmarkType;
};

const BookmarkDetailCardTitle = ({ bookmark }: BookmarkDetailCardTitleProps) => {
  const navigate = useNavigate();
  const { removeBookmark, updateBookmarkAlias } = useBookmarks();

  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInputValue, setAliasInputValue] = useState('');

  const handleStartEdit = () => {
    setAliasInputValue(bookmark.alias);
    setIsEditingAlias(true);
  };

  const handleSaveAlias = () => {
    const trimmed = aliasInputValue.trim();
    if (trimmed) updateBookmarkAlias(bookmark.id, trimmed);
    setIsEditingAlias(false);
  };

  const handleCancelEdit = () => {
    setAliasInputValue(bookmark.alias);
    setIsEditingAlias(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveAlias();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleRemove = () => {
    removeBookmark(bookmark.id);
    navigate('/');
  };

  if (isEditingAlias) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="min-w-0 flex-1 rounded-lg bg-white/20 px-3 py-1.5 outline-none sm:py-1 sm:text-lg"
          autoFocus
          value={aliasInputValue}
          onChange={e => setAliasInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton onClick={handleSaveAlias}>
          <CheckIcon className="size-4" />
        </IconButton>
        <IconButton onClick={handleCancelEdit}>
          <XMarkIcon className="size-4" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <p className="truncate">{bookmark.alias}</p>
        <IconButton onClick={handleStartEdit}>
          <PencilIcon className="size-4" />
        </IconButton>
      </div>
      <IconButton
        className="size-9 shrink-0 text-red-300 hover:bg-red-500/20 hover:text-red-50 active:bg-red-500/30 sm:size-10"
        onClick={handleRemove}
      >
        <TrashIcon className="size-5 sm:size-6" />
      </IconButton>
    </div>
  );
};
export default BookmarkDetailCardTitle;
