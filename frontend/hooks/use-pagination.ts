import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { NUM_EVENTS_PER_PAGE } from "@/queries/event";
import { isNumeric, isPositiveNumeric } from "@/utils/string";

interface usePaginationProps {
  totalCount?: number;
}

function usePagination({ totalCount }: usePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page");
  const page = isPositiveNumeric(pageStr) ? parseInt(pageStr!) : 1;
  const pageCount =
    totalCount !== undefined
      ? Math.max(Math.ceil(totalCount / NUM_EVENTS_PER_PAGE), 1)
      : undefined;

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

  const changePage = (page: number) => router.push(getPageUrl(page));

  useEffect(() => {
    if (totalCount === 0) {
      changePage(1);
    }
  }, [totalCount]);

  useEffect(() => {
    if (!pageStr) {
      changePage(1);
    }

    if (pageCount !== undefined) {
      if (page <= 0) {
        changePage(1);
      }
      if (page > pageCount) {
        changePage(pageCount);
      }
    }
  }, [pageStr, pageCount]);

  return { page, pageCount, getPageUrl };
}

export default usePagination;
