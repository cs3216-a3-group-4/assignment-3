import React from "react";

import { cn } from "@/lib/utils";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <div className={cn(className)} ref={ref} {...props} />
  ),
);

Box.displayName = "Box";

export { Box };
