import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleAlert } from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/queries/user";

const changePasswordCompleteFormSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
    oldPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ChangePasswordRequestForm = z.infer<
  typeof changePasswordCompleteFormSchema
>;

const changePasswordFormDefault = {
  password: "",
  confirmPassword: "",
  oldPassword: "",
};

export default function ChangePasswordForm() {
  const [isError, setIsError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const form = useForm<ChangePasswordRequestForm>({
    resolver: zodResolver(changePasswordCompleteFormSchema),
    defaultValues: changePasswordFormDefault,
  });
  const changePasswordMutation = useChangePassword();

  const onSubmit: SubmitHandler<ChangePasswordRequestForm> = (data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: async (data) => {
        if (data.error) {
          setIsError(true);
          setSuccess(false);
        } else {
          setIsError(false);
          setSuccess(true);
        }
      },
    });
  };

  return (
    <div className="flex flex-col w-auto mx-4 md:mx-16 xl:mx-56 py-8">
      <div className="">
        <h2 className="text-2xl 2xl:text-3xl font-bold">Change password</h2>
        <Box className="space-y-6 mt-4">
          {isError && (
            <Alert variant="destructive">
              <CircleAlert className="h-5 w-5" />
              <AlertDescription>Wrong password. Try again?</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="teal">
              <Check className="h-5 w-5" />
              <AlertDescription>
                Successfully changed password.
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Box className="flex flex-col space-y-2.5">
                  <FormField
                    control={form.control}
                    name={"oldPassword"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!text-current">
                          Old password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? "text" : "password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Box>
              </div>
              <div className="space-y-4">
                <Box className="flex flex-col space-y-2.5">
                  <FormField
                    control={form.control}
                    name={"password"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!text-current">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? "text" : "password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Box>
              </div>
              <div className="space-y-4">
                <Box className="flex flex-col space-y-2.5">
                  <FormField
                    control={form.control}
                    name={"confirmPassword"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!text-current">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? "text" : "password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Box>
              </div>
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Box>
      </div>
    </div>
  );
}
