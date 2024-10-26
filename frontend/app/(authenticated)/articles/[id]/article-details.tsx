import { ClockIcon, LayoutDashboardIcon, NewspaperIcon } from "lucide-react";

import { ArticleDTO } from "@/client";
import CategoryChip from "@/components/display/category-chip";
import { getCategoryFor } from "@/types/categories";
import { parseDate } from "@/utils/date";

interface Props {
  article: ArticleDTO;
}

const ArticleDetails = ({ article }: Props) => {
  const articleCategories = article.categories.map((category) =>
    getCategoryFor(category.name),
  );

  return (
    <div className="flex flex-col px-6 text-muted-foreground font-[450] space-y-4 md:space-y-4">
      <div className="grid grid-cols-12 gap-x-4 gap-y-3 place-items-start">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <LayoutDashboardIcon
            className="inline-flex mr-2"
            size={16}
            strokeWidth={2.3}
          />
          Categories
        </span>
        <div className="flex flex-wrap gap-x-3 gap-y-2 col-span-12 md:col-span-8 xl:col-span-9">
          {articleCategories.map((category) => (
            <CategoryChip category={category} key={category} />
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <ClockIcon className="inline-flex mr-2" size={16} strokeWidth={2.3} />
          Article date
        </span>
        <span className="col-span-10  md:col-span-8 xl:col-span-9 text-black font-normal">
          {parseDate(article.date)}
        </span>
      </div>
      <div className="flex gap-2 md:hidden">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <ClockIcon className="inline-flex mr-2" size={16} strokeWidth={2.3} />
          Article date
        </span>
        <span className="col-span-10  md:col-span-8 xl:col-span-9 text-black font-normal">
          {parseDate(article.date)}
        </span>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <NewspaperIcon
            className="inline-flex mr-2"
            size={16}
            strokeWidth={2.3}
          />
          News source
        </span>
        <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black font-normal">
          <a className="underline" href={article.url}>
            {article.source.replace("GUARDIAN", "Guardian")}
          </a>
        </span>
      </div>

      <div className="flex gap-2 md:hidden">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <NewspaperIcon
            className="inline-flex mr-2"
            size={16}
            strokeWidth={2.3}
          />
          News source
        </span>
        <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black font-normal">
          <a className="underline" href={article.url}>
            {article.source.replace("GUARDIAN", "Guardian")}
          </a>
        </span>
      </div>
    </div>
  );
};

export default ArticleDetails;
