import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { categoriesToDisplayName } from "@/types/categories";
import { getCategories } from "@/queries/category";
import { useQuery } from "@tanstack/react-query";

interface DynamicBreadcrumbProps {
  pathname: string;
}

// horrible code + easily breakable, you have been warned!!

// For simplicity, don't return numbers or query string etc
const DynamicBreadcrumb = ({ pathname }: DynamicBreadcrumbProps) => {
  const segments = pathname
    .split(/[:\/?#\[\]@!$&'()*+,;=]+/)
    .filter((segment) => segment.length > 0);

  try {
    if (segments.length === 0) {
      // Assume home
      return (
        <Breadcrumb className="font-medium text-lg">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    if (segments[0] === "categories") {
      const { data: categories, isSuccess } = useQuery(getCategories());
      const category = categories?.find(
        (category) => category.id.toString() === segments[1],
      );

      return (
        <Breadcrumb className="font-medium text-lg">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
            {isSuccess && category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={pathname}>
                    {category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    const numSegments = segments.length;
    const breadcrumbItems: JSX.Element[] = segments.map((segment, index) => (
      <div key={segment} className="inline-flex items-center gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbPage>
            {segment.charAt(0).toLocaleUpperCase()}
            {segment.slice(1)}
          </BreadcrumbPage>
        </BreadcrumbItem>
        {index === numSegments - 1 ? <></> : <BreadcrumbSeparator />}
      </div>
    ));

    return (
      <Breadcrumb className="font-medium text-lg">
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </Breadcrumb>
    );
  } catch (error) {
    // pray this doesn't happen
    return <span>{segments?.join("/")}</span>;
  }
};

export default DynamicBreadcrumb;
