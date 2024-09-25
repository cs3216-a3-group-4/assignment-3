import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";

import { CategoryDTO, MiniEventDTO } from "@/client";
import Chip from "@/components/display/chip";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";

const NewsArticle = (props: { newsEvent: MiniEventDTO }) => {
  const newsEvent = props.newsEvent;
  const newsArticle = newsEvent.original_article;
  const [categories, setCategories] = useState<Category[]>([]);
  const PLACEHOLDER_IMG_URL =
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";

  useEffect(() => {
    setCategories(
      newsEvent.categories.map((category: CategoryDTO) =>
        getCategoryFor(category.name),
      ),
    );
  }, [newsEvent]);

  const parseDate = (dateString: string) => {
    const PLACEHOLDER_DATE = "-";

    try {
      const date: Date = new Date(dateString);
      return date.toDateString();
    } catch (error) {
      console.log(error);
      return PLACEHOLDER_DATE;
    }
  };

  return (
    <div className="flex flex-col-reverse py-10 lg:flex-row w-auto lg:py-6 xl:py-4 gap-x-16 border-y-[1px] lg:border-y-[0px] hover:bg-muted/70 lg:rounded-md px-4 md:px-8">
      <div className="flex flex-col w-full lg:w-7/12 2xl:w-9/12 3xl:w-10/12">
        <div className="flex w-full justify-between text-sm text-offblack">
          <span>
            <ArrowUpRightIcon className="inline-flex" size={16} />
            {newsArticle.source}
          </span>
          <span>{parseDate(newsEvent.date)}</span>
        </div>
        <h2 className="text-lg font-semibold mt-2">{newsEvent.title}</h2>
        <p className="text-sm text-offblack">{newsEvent.description}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-6">
          {categories?.map((category: Category) => (
            <Chip
              Icon={categoriesToIconsMap[category]}
              key={category}
              label={categoriesToDisplayName[category]}
              variant="greygreen"
            />
          ))}
        </div>
      </div>
      <div className="flex w-full lg:w-5/12 2xl:w-3/12 3xl:w-2/12 mb-6 items-center">
        <Image
          alt=""
          height={154}
          src={newsArticle.image_url || PLACEHOLDER_IMG_URL}
          style={{
            width: "100%",
            height: "fit-content",
          }}
          unoptimized
          width={273}
        />
      </div>
    </div>
  );
};

export default NewsArticle;
