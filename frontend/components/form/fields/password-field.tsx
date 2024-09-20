import { useFormContext } from "react-hook-form";

import PasswordInput, {
  PasswordInputOnlyProps,
} from "@/components/form/inputs/password-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PasswordFieldProps extends PasswordInputOnlyProps {
  name: string;
  label: string;
  placeholder?: string;
}

function PasswordField({
  name,
  label,
  placeholder,
  ...inputProps
}: PasswordFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className="!text-current">{label}</FormLabel>}
          <FormControl>
            <PasswordInput
              placeholder={placeholder}
              {...field}
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default PasswordField;
