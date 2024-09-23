import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";

import Chip from "@/components/display/chip";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";

const sampleArticleCategories = [
  Category.Economics,
  Category.Environment,
  Category.Media,
  Category.Politics,
];

const NewsArticle = () => {
  return (
    <div className="flex flex-col-reverse py-10 lg:flex-row w-auto lg:py-6 xl:py-4 gap-x-16 border-y-[1px] lg:border-y-[0px] hover:bg-muted/70 lg:rounded-md px-4 md:px-8">
      <div className="flex flex-col w-full lg:w-7/12 2xl:w-9/12 3xl:w-10/12">
        <div className="flex w-full justify-between text-sm text-offblack">
          <span>
            <ArrowUpRightIcon className="inline-flex" size={16} /> CNA, Guardian
          </span>
          <span>21 Sep 2024</span>
        </div>
        <h2 className="text-lg font-semibold mt-2">
          Norris Claims Singapore GP Pole Amid Ferrari’s Setback
        </h2>
        <p className="text-sm text-offblack">
          A Reflection on Commercialization, Sustainability, and Global Sports
          as Cultural Forces
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-6">
          {sampleArticleCategories.map((category) => (
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
          src="https://onecms-res.cloudinary.com/image/upload/s--893X2dru--/c_fill,g_auto,h_468,w_830/fl_relative,g_south_east,l_mediacorp:cna:watermark:2021-08:cna,w_0.1/f_auto,q_auto/v1/mediacorp/cna/image/2024/09/21/RAY_3553.JPG?itok=aFJ8bcqO"
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
