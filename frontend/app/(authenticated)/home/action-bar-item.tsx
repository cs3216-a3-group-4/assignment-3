import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionBarItemProps {
  title: string;
  actionPath: string;
  actionLabel: string;
  description: string;
  children?: ReactNode;
  twoLine?: boolean;
}

const ActionBarItem = ({
  title,
  actionPath,
  actionLabel,
  description,
  children,
  twoLine = false,
}: ActionBarItemProps) => {
  return (
    <div>
      <div className="flex md:flex-col lg:flex-row flex-wrap justify-between xl:items-center mb-2 w-full text-primary-700">
        <h2 className="font-semibold overflow-ellipsis text-nowrap">{title}</h2>
        <Link
          className={cn(
            "flex items-center gap-1 underline hover:text-primary-700/60",
            twoLine && "w-full",
          )}
          href={actionPath}
        >
          {actionLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col w-full text-text">
        <p className="text-sm md:text-base line-clamp-4 text-ellipsis md:h-[100px] lg:h-[80px] xl:h-[6vh]">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};

export default ActionBarItem;
