import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
}

function CheckboxField({ name, label, description }: CheckboxFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {label && (
                <FormLabel className="!text-current">{label}</FormLabel>
              )}
            </div>
          </FormControl>

          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export default CheckboxField;
