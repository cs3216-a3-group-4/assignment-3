import Image from "next/image";
import Link from "next/link";

import { MiniArticleDTO } from "@/client";
import Chip from "@/components/display/chip";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";
import { parseDateNoYear } from "@/utils/date";

interface ArticleCardProps {
  article: MiniArticleDTO;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div
      className="py-4 w-full border-t-[1px] first:border-none lg:border-y-[0px] md:py-2"
      key={article.id}
    >
      <div className="py-2 flex gap-3 md:gap-2 justify-between md:py-0">
        <div>
          <Link href={`/articles/${article.id}`}>
            <h4 className="text-sm md:text-lg font-medium hover:underline">
              {article.title}{" "}
            </h4>
          </Link>
          <div className="flex-1 flex-wrap gap-2 mt-2 hidden md:flex">
            <span className="text-sm font-light mr-2 text-text">
              {parseDateNoYear(article.date)}
            </span>{" "}
            {article.categories
              ?.map((category) => getCategoryFor(category.name))
              .map((category: Category, index: number) => (
                <Chip
                  Icon={categoriesToIconsMap[category]}
                  className="px-0 md:px-2"
                  key={index}
                  label={categoriesToDisplayName[category]}
                  size="sm"
                  variant="nobg"
                />
              ))}
          </div>
        </div>
        <div className="w-24 flex-shrink-0">
          <Image
            alt={article.title}
            height={100}
            src={article.image_url}
            unoptimized
            width={100}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-wrap gap-2 mt-2 md:hidden">
        <span className="text-sm font-light mr-2 text-text">
          {parseDateNoYear(article.date)}
        </span>{" "}
        {article.categories
          ?.map((category) => getCategoryFor(category.name))
          .map((category: Category, index: number) => (
            <Chip
              Icon={categoriesToIconsMap[category]}
              className="px-0 md:px-2"
              key={index}
              label={categoriesToDisplayName[category]}
              size="sm"
              variant="nobg"
            />
          ))}
      </div>
    </div>
  );
};

export default ArticleCard;
