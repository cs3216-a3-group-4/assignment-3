import {
  Bookmark,
  BookmarkCheck,
  BookmarkCheckIcon,
  BookmarkMinusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useAddBookmarkArticle,
  useRemoveBookmarkArticle,
} from "@/queries/bookmark";

interface ArticleBookmarkButtonProps {
  isBookmarked: boolean;
  articleId: number;
  articleTitle: string;
  showLabel?: boolean;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "destructive_outline"
    | "secondary"
    | "ghost"
    | "destructive_ghost"
    | "underlined"
    | null
    | undefined;
}

const ArticleBookmarkButton = ({
  isBookmarked,
  articleId,
  articleTitle,
  showLabel = false,
  variant = "default",
}: ArticleBookmarkButtonProps) => {
  const toast = useToast();
  const addBookmarkMutation = useAddBookmarkArticle(articleId);
  const removeBookmarkMutation = useRemoveBookmarkArticle(articleId);

  if (isBookmarked) {
    return (
      <Button
        className="flex gap-2 px-4"
        onClick={(e) => {
          e.stopPropagation();
          removeBookmarkMutation.mutate();
          toast.toast({
            title: "Removed bookmark",
            icon: <BookmarkMinusIcon />,
            description: `Bookmark removed for ${articleTitle}`,
          });
        }}
        size="lg"
        variant={variant}
      >
        <BookmarkCheck className="w-5 h-5" /> {showLabel && "Bookmarked"}
      </Button>
    );
  }

  return (
    <Button
      className="flex gap-2 px-4"
      onClick={(e) => {
        e.stopPropagation();
        addBookmarkMutation.mutate();
        toast.toast({
          title: "Added bookmark",
          icon: <BookmarkCheckIcon />,
          description: `Bookmark added for ${articleTitle}`,
        });
      }}
      size="lg"
      variant={variant}
    >
      <Bookmark className="w-5 h-5" /> {showLabel && "Bookmark"}
    </Button>
  );
};

export default ArticleBookmarkButton;
