"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRightIcon } from "lucide-react";

import { CategoryDTO, MiniEventDTO } from "@/client";
import Chip from "@/components/display/chip";
import PlaceholderImage from "@/components/icons/placeholder-image";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";
import { parseDate } from "@/utils/date";
import { articleSourceToDisplayNameMap } from "@/types/events";

const NewsArticle = (props: { newsEvent: MiniEventDTO }) => {
  const newsEvent = props.newsEvent;
  const newsArticle = newsEvent.original_article;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const ASPECT_RATIO = 273 / 154;
  const IMG_WIDTH = 200;
  const IMG_HEIGHT = IMG_WIDTH / ASPECT_RATIO;

  useEffect(() => {
    try {
      setCategories(
        newsEvent.categories.map((category: CategoryDTO) =>
          getCategoryFor(category.name),
        ),
      );
    } catch (error) {
      console.log(error);
      setCategories([Category.Others]);
    }
  }, [newsEvent]);

  const onClick = () => {
    router.push(`/events/${newsEvent.id}`);
  };

  return (
    <div
      className="flex flex-col-reverse py-10 lg:flex-row w-auto lg:py-6 xl:px-12 xl:py-10 gap-x-28 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md px-4 md:px-8 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col w-full lg:w-8/12 2xl:w-9/12 3xl:w-10/12">
        <div className="flex w-full justify-between text-text-muted/90">
          <span>{articleSourceToDisplayNameMap[newsArticle.source]}</span>
          <span>{parseDate(newsEvent.date)}</span>
        </div>
        <h2 className="text-2xl font-semibold mt-2 mb-3 text-primary-900">
          {newsEvent.title}
        </h2>
        <p>{newsEvent.description}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-8">
          {categories?.map((category: Category, index: number) => (
            <Chip
              Icon={categoriesToIconsMap[category]}
              key={index}
              label={categoriesToDisplayName[category]}
              variant="primary"
              size="lg"
            />
          ))}
        </div>
      </div>
      <div className="flex w-full h-full lg:w-4/12 2xl:w-3/12 3xl:w-2/12 mb-6 items-start justify-end">
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
      </div>
    </div>
  );
};

export default NewsArticle;
