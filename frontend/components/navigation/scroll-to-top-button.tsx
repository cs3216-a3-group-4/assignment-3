"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToTopButtonProps extends Omit<ButtonProps, "children"> {
  scrollElementId: string;
  minHeight?: number;
  scrollTo?: number;
}

// Adapted fom https://github.com/shadcn-ui/ui/issues/4048
const ScrollToTopButton = ({
  scrollElementId,
  className,
  minHeight = 0, // Height to go on scroll to top
  scrollTo = 0,
  ...props
}: ScrollToTopButtonProps) => {
  const scrollElement = document.querySelector(`#${scrollElementId}`);
  const [visible, setVisible] = useState(false);

  const onScrollBack = () =>
    scrollElement?.scrollTo({ top: scrollTo, behavior: "smooth" });

  useEffect(() => {
    if (scrollElement === null) return;
    if (scrollElement.scrollTop === undefined) return;

    const onScroll = () => setVisible(scrollElement.scrollTop >= minHeight);
    onScroll();
    scrollElement.addEventListener("scroll", onScroll);
    return () => scrollElement.removeEventListener("scroll", onScroll);
  }, [scrollElement, minHeight]);

  return (
    <>
      {visible && (
        <Button
          className={cn(
            "group animate-fade-up transition-all ease-in-out delay-75 duration-300 text-lg hover:bg-primary hover:text-primary-foreground",
            className,
          )}
          onClick={onScrollBack}
          variant="ghost"
          {...props}
        >
          <ArrowUpIcon
            className="stroke-primary group-hover:stroke-primary-foreground"
            strokeWidth={2.5}
          />
          <span className="hidden group-hover:inline-flex group-hover:animate-fade-left ml-4">
            Scroll to top
          </span>
        </Button>
      )}
    </>
  );
};

export default ScrollToTopButton;
