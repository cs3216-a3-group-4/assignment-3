import { forwardRef, useState } from "react";

import Link from "@/components/navigation/link";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
      <Box className="flex flex-col space-y-3">
        <Input
          className={cn("hide-password-toggle pr-10", className)}
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isPasswordVisible}
              id="password-visibility"
              onCheckedChange={(checkedState) =>
                setIsPasswordVisible(
                  checkedState === "indeterminate" ? false : checkedState,
                )
              }
            />
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password-visibility"
            >
              Show password
            </label>
          </div>
          <Link href="/user/password-reset" size="sm">
            Forgot password?
          </Link>
        </div>
      </Box>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
