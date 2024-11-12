import { FC, ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  color?: string;
}

const Highlight: FC<HighlightProps> = ({ children, color = "bg-primary" }) => {
  return (
    <span
      className={`${color} px-1 rounded-md inline align-baseline text-white`}
    >
      {children}
    </span>
  );
};

export default Highlight;
