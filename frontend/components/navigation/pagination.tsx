import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  getPageUrl: (page: number) => string;
  pageCount?: number;
}

const Pagination = ({ page, getPageUrl, pageCount }: PaginationProps) => {
  const router = useRouter();

  const [inputPage, setInputPage] = useState(page.toString());
  const [debouncedPage, setDebouncedPage] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedPage && /^\d+$/.test(debouncedPage)) {
        router.push(getPageUrl(parseInt(debouncedPage)));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [debouncedPage, router, getPageUrl]);

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputPage(event.target.value);
    setDebouncedPage(event.target.value);
  };

  return (
    <PaginationPrimitive className="py-8">
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(page - 1)} />
          </PaginationItem>
        )}
        <PaginationItem className="flex align-center">
          <Input
            className="text-center"
            onChange={handleChange}
            size={1}
            value={inputPage}
          ></Input>{" "}
          <div className="whitespace-nowrap my-auto pl-2">of {pageCount}</div>
        </PaginationItem>
        {page !== pageCount && (
          <PaginationItem>
            <PaginationNext href={getPageUrl(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationPrimitive>
  );
};

export default Pagination;
