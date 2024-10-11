import {
  Bookmark,
  BookmarkCheck,
  BookmarkCheckIcon,
  BookmarkMinusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAddBookmark, useRemoveBookmark } from "@/queries/bookmark";

interface EventBookmarkButtonProps {
  isBookmarked: number;
  eventId: number;
  eventTitle: string;
}

const EventBookmarkButton = ({
  isBookmarked,
  eventId,
  eventTitle,
}: EventBookmarkButtonProps) => {
  const toast = useToast();
  const addBookmarkMutation = useAddBookmark(eventId);
  const removeBookmarkMutation = useRemoveBookmark(eventId);

  if (isBookmarked) {
    return (
      <Button
        className="flex gap-2 px-4"
        onClick={() => {
          removeBookmarkMutation.mutate();
          toast.toast({
            title: "Removed bookmark",
            icon: <BookmarkMinusIcon />,
            description: `Bookmark removed for ${eventTitle}`,
          });
        }}
        size="lg"
        variant="default"
      >
        <BookmarkCheck className="w-5 h-5" /> Bookmarked
      </Button>
    );
  }

  return (
    <Button
      className="flex gap-2 px-4"
      onClick={() => {
        addBookmarkMutation.mutate();
        toast.toast({
          title: "Added bookmark",
          icon: <BookmarkCheckIcon />,
          description: `Bookmark added for ${eventTitle} ${isBookmarked}`,
        });
      }}
      size="lg"
      variant="outline"
    >
      <Bookmark className="w-5 h-5" /> Bookmark
    </Button>
  );
};

export default EventBookmarkButton;
