import { ArrowUpIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ScrollToTopButtonProps extends ButtonProps {
  scrollToId: string;
}

// Adapted fom https://github.com/shadcn-ui/ui/issues/4048
const ScrollToTopButton = ({
  scrollToId, // Height to go on scroll to top
  ...props
}: ScrollToTopButtonProps) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`#${scrollToId}`)} {...props}>
      <ArrowUpIcon />
    </Button>
  );
};

export default ScrollToTopButton;
