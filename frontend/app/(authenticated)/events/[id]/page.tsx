"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getEvent } from "@/queries/event";
import { useQuery } from "@tanstack/react-query";
import ArticlePageLoading from "@/app/(authenticated)/articles/[id]/article-page-loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RotateCwIcon } from "lucide-react";

const Page = ({ params }: { params: { id: string } }) => {
  // Redirect events path to new articles page to support legacy URLs
  const id = parseInt(params.id);
  const { data, isError, isLoading, isSuccess } = useQuery(getEvent(id));
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isError) return;
    const articleId = data?.original_article.id;
    if (isSuccess && articleId !== undefined) {
      router.push(`/articles/${articleId}`);
    }
  }, [router, isError, isLoading, isSuccess]);

  if (
    (!isLoading && isError) ||
    (isSuccess && data?.original_article.id == undefined)
  ) {
    return (
      <div className="w-full min-h-full bg-muted px-8 md:px-16 xl:px-56 py-8">
        <div className="px-16 py-10 bg-background border border-border rounded-lg">
          <h1 className="text-3xl font-semibold">
            Uh oh... something went wrong
          </h1>
          <p className="text-xl mt-3 mb-2">
            Jippy ran into an error fetching the event you requested.
          </p>
          <p>
            If this error persists, please let us know at{" "}
            <a className="underline" href="mailto:jippythefrog@gmail.com">
              jippythefrog@gmail.com
            </a>
            .
          </p>
          <Button className="mt-6" onClick={() => location.reload()}>
            <RotateCwIcon className="h-4 w-4 mr-3" />
            Refresh page
          </Button>
        </div>
      </div>
    );
  }

  return <ArticlePageLoading />;
};

export default Page;
