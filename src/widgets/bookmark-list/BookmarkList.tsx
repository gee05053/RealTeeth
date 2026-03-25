import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import BookmarkCard from '@/widgets/bookmark-card/BookmarkCard';

const BookmarkList = () => {
  const { bookmarks, removeBookmark, updateBookmarkAlias } = useBookmarks();

  return (
    <section>
      <h3 className="mb-3 text-sm font-medium text-white/60">북마크</h3>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {bookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemoveBookmark={removeBookmark}
              onUpdateBookmarkAlias={updateBookmarkAlias}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/40">현재 추가된 북마크가 없어요.</p>
      )}
    </section>
  );
};

export default BookmarkList;
