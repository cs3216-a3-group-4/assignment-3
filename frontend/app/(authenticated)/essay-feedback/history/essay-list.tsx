import { EssayMiniDTO } from "@/client";
import { Skeleton } from "@/components/ui/skeleton";

import EssayListCard from "./essay-list-card";

interface EssayListProps {
  essays?: EssayMiniDTO[];
  isLoading: boolean;
}

const EssayList = ({ essays, isLoading }: EssayListProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-[223px] bg-primary-100/80" />
        <Skeleton className="w-full h-[223px] bg-primary-100/80" />
        <Skeleton className="w-full h-[223px] bg-primary-100/80" />
      </>
    );
  }

  const numEssays = essays?.length;
  if (numEssays === 0 || numEssays === undefined) {
    return (
      <div className="flex flex-col w-full text-text/80 bg-primary-100/80 px-4 py-4 mt-4 rounded-sm">
        <span className="font-[450]">No essays submitted yet</span>
      </div>
    );
  }

  return (
    <>
      {essays
        ?.sort((essay1, essay2) => essay2.id - essay1.id)
        .map((essay) => <EssayListCard essay={essay} key={essay.id} />)}
    </>
  );
};

export default EssayList;
