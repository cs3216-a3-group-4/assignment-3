"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { CategoryDTO } from "@/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCategories } from "@/queries/category";
import { getEventsForCategory } from "@/queries/event";

import Articles from "./articles-list";

function isNumeric(value: string | null) {
  return value !== null && /^-?\d+$/.test(value);
}

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = parseInt(params.id);

  const pageStr = searchParams.get("page");

  const page = isNumeric(pageStr) ? parseInt(pageStr!) : 1;

  const [categoryName, setCategoryName] = useState<string>("");
  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getEventsForCategory(categoryId, page),
  );
  const { data: categories, isSuccess: isCategoriesLoaded } =
    useQuery(getCategories());

  // Very inefficient, but is there a better way to do this? New StoreProvider for CategoryDTO[]?
  useEffect(() => {
    if (isCategoriesLoaded && categories!.length > 0) {
      categories!.forEach((category: CategoryDTO) => {
        if (category.id == categoryId) {
          setCategoryName(category.name);
        }
      });
    }
  }, [categories, isCategoriesLoaded, categoryId]);

  const getPageUrl = (page: number) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    // update as necessary
    current.set("page", page.toString());

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    return `${pathname}${query}`;
  };

  const changePage = (page: number) => {
    router.push(getPageUrl(page));
  };

  if (!pageStr) {
    changePage(1);
    return;
  }

  const items = events?.total_count;
  const pageCount = items !== undefined && Math.ceil(items / 10);
  if (pageCount !== false) {
    if (page <= 0) {
      changePage(1);
    }
    if (page > pageCount) {
      changePage(pageCount);
    }
  }

  return (
    <div className="flex flex-col w-full py-8">
      <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-32">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <h1 className="text-3xl 2xl:text-4xl font-bold">
          Top events from {categoryName}
        </h1>
      </div>

      <div className="flex flex-col w-auto mx-4 md:mx-8 xl:mx-24">
        <Articles eventData={events?.data} isEventsLoaded={isEventsLoaded} />
      </div>

      {isEventsLoaded && (
        <Pagination className="py-8">
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem>
                <PaginationPrevious href={getPageUrl(page - 1)} />
              </PaginationItem>
            )}
            {/* Only for last page */}
            {page == pageCount && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(page - 2)}>
                  {page - 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {page !== 1 && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(page - 1)}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            {page !== pageCount && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(page + 1)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Only for first page */}
            {page === 1 && (pageCount as number) >= 3 && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(page + 2)}>
                  {page + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {page !== pageCount && (
              <PaginationItem>
                <PaginationNext href={getPageUrl(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Page;
