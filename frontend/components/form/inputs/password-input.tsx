import { forwardRef, useState } from "react";

import Link from "@/components/navigation/link";
import { Box } from "@/components/ui/box";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputOnlyProps {
  showForgetPassword?: boolean;
  helperText?: string;
}

interface PasswordInputProps extends InputProps, PasswordInputOnlyProps {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showForgetPassword = false, helperText, className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
      <Box className="flex flex-col space-y-2.5">
        <Input
          className={cn("hide-password-toggle pr-10", className)}
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          {...props}
        />
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        <div className="flex flex-row items-end justify-between">
          <div className="flex items-center gap-x-2">
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

          {showForgetPassword && (
            <Link href="/reset-password" size="sm">
              Forgot password?
            </Link>
          )}
        </div>
      </Box>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
