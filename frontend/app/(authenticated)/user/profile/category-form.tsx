"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCategories } from "@/queries/category";
import { useUpdateProfile } from "@/queries/user";
import { getCategoryFor } from "@/types/categories";

interface Props {
  initialCategoryIds: number[];
}

export default function CategoryForm({ initialCategoryIds }: Props) {
  const { data: categories, isLoading } = useQuery(getCategories());
  const [categoryIds, setCategoryIds] = useState<number[]>(initialCategoryIds);

  const toggleCategory = (id: number) => {
    if (!categoryIds.includes(id)) {
      setCategoryIds([...categoryIds, id]);
    } else {
      setCategoryIds(categoryIds.filter((item) => item !== id));
    }
  };

  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = () => {
    updateProfileMutation.mutate({ categoryIds });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-auto mx-4 md:mx-16 xl:mx-56 pb-4">
      <div className="">
        <h2 className="text-2xl 2xl:text-3xl font-bold">Categories</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Select the General Paper categories you are interested in.
        </p>
        <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
          {categories!.map((category) => {
            const isActive = categoryIds.includes(category.id);
            return (
              <div
                className={clsx(
                  "font-medium p-3 px-4 rounded-3xl cursor-pointer shadow-md mt-4",
                  {
                    "bg-emerald-600 text-white": isActive,
                    "bg-slate-100": !isActive,
                  },
                )}
                key={category.id}
                onClick={() => toggleCategory(category.id)}
              >
                {getCategoryFor(category.name)}
              </div>
            );
          })}
        </div>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}
