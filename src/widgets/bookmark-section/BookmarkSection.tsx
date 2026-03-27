import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import Card from '@/shared/ui/card/Card';

import BookmarkCard from './BookmarkCard';

const BookmarkSection = () => {
  const { bookmarks, removeBookmark, updateBookmarkAlias } = useBookmarks();

  return (
    <Card title="북마크" classNames={{ content: 'grid grid-cols-3 gap-3' }}>
      {bookmarks.length > 0 ? (
        bookmarks.map(bookmark => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onRemoveBookmark={removeBookmark}
            onUpdateBookmarkAlias={updateBookmarkAlias}
          />
        ))
      ) : (
        <p className="text-sm text-white/70">현재 추가된 북마크가 없어요.</p>
      )}
    </Card>
  );
};

export default BookmarkSection;
