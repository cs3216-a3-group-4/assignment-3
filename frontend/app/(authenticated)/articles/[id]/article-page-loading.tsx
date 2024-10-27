import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ArticlePageLoading = () => {
  return (
    <div className="w-full h-fit min-h-full bg-muted sm:px-8 md:px-16 xl:px-56">
      <div className="flex flex-col bg-background">
        <div className="flex flex-col gap-y-10">
          <div className="flex w-full max-h-52 overflow-y-clip items-center">
            <Skeleton className="w-full h-52 bg-gray-200 rounded-none" />
          </div>
          <div className="px-3 md:px-8 flex flex-col gap-y-8">
            <Skeleton className="w-[80%] h-[48px] bg-gray-200" />
            <Skeleton className="w-full h-[100px] bg-gray-200" />
            <Skeleton className="w-full h-[240px] bg-gray-200" />
            <div className="flex flex-wrap gap-x-4 gap-y-4">
              <Skeleton className="w-[270.35px] h-11 bg-gray-200" />
              <Skeleton className="w-[270.35px] h-11 bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="px-3 md:px-8 flex flex-col pb-8 gap-y-4">
          <Separator className="my-4 lg:my-8" />
          <Skeleton className="w-full h-[240px] bg-gray-200" />
          <Separator className="my-4 lg:my-6" />
          <Skeleton className="w-full h-[240px] bg-gray-200" />
          <Separator className="my-4 lg:my-6" />
          <Skeleton className="w-full h-[240px] bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ArticlePageLoading;
