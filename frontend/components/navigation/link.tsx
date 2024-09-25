import NextLink, { LinkProps as InternalLinkProps } from "next/link";
import { cva, VariantProps } from "class-variance-authority";
import { ExternalLinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type LinkClassValueVariant = {
  variant: {
    ghost: string;
    underlined: string;
  };
};

type LinkClassValueSize = {
  size: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

type LinkClassValue = LinkClassValueVariant & LinkClassValueSize;
const linkVariants = cva<LinkClassValue>("underline hover:text-black/75", {
  variants: {
    variant: { ghost: "", underlined: "underline" },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    variant: "underlined",
    size: "md",
  },
});

type ExternalIconClassValue = LinkClassValueSize;
const externalIconVariants = cva<ExternalIconClassValue>("inline-flex", {
  variants: {
    size: {
      xs: "h-3 w-3 ml-1",
      sm: "h-4 w-4 ml-1",
      md: "h-4 w-4 ml-2",
      lg: "h-4 w-4 ml-2",
      xl: "h-5 w-5 ml-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type NextLinkType = InternalLinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof InternalLinkProps>;

interface LinkProps extends NextLinkType, VariantProps<typeof linkVariants> {
  opensInNewTab?: boolean;
  isExternal?: boolean;
}

function Link({
  isExternal = false,
  opensInNewTab = isExternal,
  className,
  variant,
  size,
  ...props
}: LinkProps) {
  let linkProps: typeof props = props;
  if (opensInNewTab) {
    linkProps = { ...props, rel: "noopener noreferrer", target: "_blank" };
  }
  return (
    <div className="inline">
      <NextLink
        {...linkProps}
        className={cn(linkVariants({ variant, size }), className)}
      />
      {isExternal && (
        <ExternalLinkIcon className={externalIconVariants({ size })} />
      )}
    </div>
  );
}

export default Link;
