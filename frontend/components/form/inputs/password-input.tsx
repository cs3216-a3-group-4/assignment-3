import { createElement, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Box } from "@/components/ui/box";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
      <Box className="relative">
        <Input
          className={cn("hide-password-toggle pr-10", className)}
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          {...props}
        />
        <Box
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {createElement(isPasswordVisible ? EyeOffIcon : EyeIcon, {
            className: "h-6 w-6",
          })}
        </Box>
      </Box>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
