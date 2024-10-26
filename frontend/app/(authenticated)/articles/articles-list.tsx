// Modified from events-list.tsx

import { IndexResponse_MiniArticleDTO_ } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ArticleListProps {
  isArticlesLoaded: boolean;
  articles?: IndexResponse_MiniArticleDTO_;
}

const ArticlesList = ({ isArticlesLoaded, articles }: ArticleListProps) => {
  if (!isArticlesLoaded) {
    return (
      <div className="flex flex-col w-full">
        <ArticleLoading />
        <ArticleLoading />
        <ArticleLoading />
      </div>
    );
  }

  if (articles === undefined || articles.total_count === 0) {
    return (
      <div className="flex flex-col w-full px-4 md:px-8 xl:px-12 mt-4">
        <Alert className="bg-gray-200/40 text-gray-700 border-none px-8 py-4">
          <AlertTitle className="text-xl font-semibold">
            Uh oh... Jippy couldn&apos;t find any articles.
          </AlertTitle>
          <AlertDescription className="text-base">
            Jippy&apos;s probably busy reading newspapers to find more events.
            Maybe check back soon?
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {articles.data.map((newsArticle) => (
        <NewsArticle key={newsArticle.id} newsArticle={newsArticle} />
      ))}
    </div>
  );
};

export default ArticlesList;
