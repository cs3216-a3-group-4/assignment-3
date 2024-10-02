import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  getPageUrl: (page: number) => string;
  pageCount?: number;
}

const Pagination = ({ page, getPageUrl, pageCount }: PaginationProps) => {
  return (
    <PaginationPrimitive className="py-8">
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(page - 1)} />
          </PaginationItem>
        )}
        {/* Only for last page */}
        {page == pageCount && pageCount > 2 && (
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
    </PaginationPrimitive>
  );
};

export default Pagination;
