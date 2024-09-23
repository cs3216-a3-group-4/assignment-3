import { cva, VariantProps } from "class-variance-authority";

import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-sky-200/60 text-sky-600 hover:bg-sky-200/40",
        destructive: "bg-red-200/60 text-destructive/90 hover:bg-red-200/40",
      },
      size: {
        default: "h-6 px-2 py-2",
        sm: "h-5 rounded-md px-2",
        lg: "h-7 rounded-md px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ChipProps extends VariantProps<typeof chipVariants> {
  label: string;
  className: string;
}

const Chip = ({ label, variant, size, className }: ChipProps) => {
  return (
    <Box className={cn(chipVariants({ variant, size }), className)}>
      {label}
    </Box>
  );
};

export default Chip;
