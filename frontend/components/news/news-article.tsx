"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { CategoryDTO, MiniArticleDTO } from "@/client";
import Chip from "@/components/display/chip";
import PlaceholderImage from "@/components/icons/placeholder-image";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";
import { articleSourceToDisplayNameMap } from "@/types/events";
import { parseDate, parseDateNoYear } from "@/utils/date";

const NewsArticle = (props: { newsArticle: MiniArticleDTO }) => {
  const router = useRouter();

  const ASPECT_RATIO = 273 / 154;
  const IMG_WIDTH = 200;
  const IMG_HEIGHT = IMG_WIDTH / ASPECT_RATIO;

  const newsArticle = props.newsArticle;

  const categories = newsArticle.categories.map((category: CategoryDTO) =>
    getCategoryFor(category.name),
  );

  const onClick = () => {
    router.push(`/articles/${newsArticle.id}`);
  };

  return (
    <div
      className="flex h-full flex-col py-4 w-full lg:py-6 px-4 md:px-8 xl:px-12 xl:py-10 gap-x-28 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer"
      onClick={onClick}
    >
      <div className="hidden sm:flex w-full justify-between text-text-muted/90 mt-2">
        <span>{articleSourceToDisplayNameMap[newsArticle.source]}</span>
        <span>{parseDate(newsArticle.date)}</span>
      </div>
      <div className="flex gap-4 items-stretch">
        <div className="flex flex-col w-full lg:w-8/12 2xl:w-9/12 3xl:w-10/12 grow">
          <h2 className="text-md sm:text-2xl font-semibold mt-2 mb-3 text-primary-900">
            {newsArticle.title}
          </h2>
          <p className="text-sm sm:text-md line-clamp-3">
            {newsArticle.summary}
          </p>
        </div>
        <div className="mt-2 flex flex-col justify-between grow w-4/12 2xl:w-3/12 3xl:w-2/12 items-end gap-4">
          {newsArticle.image_url ? (
            <Image
              alt=""
              height={IMG_HEIGHT}
              src={newsArticle.image_url}
              style={{
                width: "100%",
                height: "fit-content",
              }}
              unoptimized
              width={IMG_WIDTH}
            />
          ) : (
            <div className="flex w-full" style={{ height: `${IMG_HEIGHT}px` }}>
              <PlaceholderImage />
            </div>
          )}
          {/* <ArticleBookmarkButton
            articleId={newsArticle.id}
            articleTitle={newsArticle.title}
            isBookmarked={newsArticle.bookmarks.length > 0}
            variant="ghost"
          /> */}
        </div>
      </div>
      <div className="hidden sm:flex flex-wrap gap-x-2 gap-y-2 mt-4 place-end">
        {categories?.map((category: Category, index: number) => (
          <Chip
            Icon={categoriesToIconsMap[category]}
            key={index}
            label={categoriesToDisplayName[category]}
            size="lg"
            variant="primary"
          />
        ))}
      </div>
      <div className="flex items-center flex-wrap gap-x-2 gap-y-2 mt-4 sm:hidden">
        <span className="text-primary-600 text-sm">
          {parseDateNoYear(newsArticle.date)}
        </span>
        {categories?.map((category: Category, index: number) => (
          <Chip
            Icon={categoriesToIconsMap[category]}
            key={index}
            label={categoriesToDisplayName[category]}
            size="sm"
            variant="primary"
          />
        ))}
      </div>
    </div>
  );
};

export default NewsArticle;
