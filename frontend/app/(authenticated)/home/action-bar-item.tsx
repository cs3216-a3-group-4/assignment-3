import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ActionBarItemProps {
  title: string;
  actionPath: string;
  actionLabel: string;
  description: string;
  children?: ReactNode;
}

const ActionBarItem = ({
  title,
  actionPath,
  actionLabel,
  description,
  children,
}: ActionBarItemProps) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-2 w-full text-primary-700">
        <h2 className="font-semibold">{title}</h2>
        <Link
          className="flex items-center gap-1 underline hover:text-primary-700/60"
          href={actionPath}
        >
          {actionLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col w-full text-text">
        <p className="h-[6vh]">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default ActionBarItem;
