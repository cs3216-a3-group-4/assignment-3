"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCategories } from "@/queries/category";
import { useUpdateProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";
import { getCategoryFor } from "@/types/categories";

export default function Onboarding() {
  const { data: categories, isLoading } = useQuery(getCategories());
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const user = useUserStore((state) => state.user);

  const toggleCategory = (id: number) => {
    if (!categoryIds.includes(id)) {
      setCategoryIds([...categoryIds, id]);
    } else {
      setCategoryIds(categoryIds.filter((item) => item !== id));
    }
  };

  const updateProfileMutation = useUpdateProfile();
  const router = useRouter();

  const handleSubmit = () => {
    updateProfileMutation.mutate(
      { categoryIds },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  };

  if (user?.categories.length) {
    router.push("/");
  }

  return (
    <div className="flex justify-center items-center  h-[calc(100vh_-_72px)]">
      <div className="flex flex-col items-center gap-16">
        {isLoading && <LoadingSpinner className="w-24 h-24" />}
        {!isLoading && (
          <>
            <h1 className="text-3xl font-bold text-center leading-[3rem]">
              Let&apos;s get started!
              <br />
              What are your preferred GP categories?
            </h1>
            <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
              {categories!.map((category) => {
                const isActive = categoryIds.includes(category.id);
                return (
                  <div
                    className={clsx(
                      "font-medium  p-3 px-4 rounded-3xl cursor-pointer shadow-md",
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
            <Button className="flex items-center gap-2" onClick={handleSubmit}>
              Save and Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
