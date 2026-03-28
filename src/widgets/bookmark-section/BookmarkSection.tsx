import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import useBookmarks from '@/features/bookmark/hooks/useBookmarks';
import Card from '@/shared/ui/card/Card';
import InlineMessage from '@/shared/ui/inline-status-message/InlineStatusMessage';

import BookmarkCard from './BookmarkCard';

const BookmarkSection = () => {
  const { bookmarks, reorderBookmarks } = useBookmarks();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorderBookmarks(String(active.id), String(over.id));
  };

  return (
    <Card
      title="북마크"
      description="카드를 끌어 북마크 순서를 변경할 수 있어요."
      classNames={{ content: 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3' }}
    >
      {bookmarks.length > 0 ? (
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={bookmarks.map(b => b.id)}>
            {bookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <InlineMessage className="col-span-full text-center">
          현재 추가된 북마크가 없어요.
        </InlineMessage>
      )}
    </Card>
  );
};

export default BookmarkSection;
