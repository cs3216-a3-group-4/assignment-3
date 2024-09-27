"use client";

import { ReactNode, useState } from "react";

import AskPage from "./ask-page";

export const MAX_GP_QUESTION_LEN: number = 120; // max character count

const Page = () => {
  // Whether an active query is running
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let child: ReactNode;
  // loading => loading-page (hasSent *, isLoading true, errorMessage *)
  if (isLoading) child = <>Loading</>;

  // fallback to ask-page just in case
  // initial => ask-page (hasSent false, isLoading false, errorMessage false)
  // validation error => ask-page (hasSent false, isLoading false, errorMessage true)
  child = <AskPage setIsLoading={setIsLoading} />;

  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      {child}
    </div>
  );
};

export default Page;
