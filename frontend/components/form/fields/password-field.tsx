import { useFormContext } from "react-hook-form";

import PasswordInput from "@/components/form/inputs/password-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
}

function PasswordField({
  name,
  label,
  placeholder,
  description,
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
            <PasswordInput placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export default PasswordField;
