"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { z } from "zod";

import PasswordField from "@/components/form/fields/password-field";
import TextField from "@/components/form/fields/text-field";
import Link from "@/components/navigation/link";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const registerFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

const registerFormDefault = {
  email: "",
  password: "",
};

type RegisterForm = z.infer<typeof registerFormSchema>;

function RegisterPage() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefault,
  });

  const onSubmit: SubmitHandler<RegisterForm> = (data) => console.log(data);

  return (
    <Box className="flex w-full space-x-24">
      <Box className="flex-col content-center bg-card text-card-foreground space-y-8 px-4 sm:px-8 md:px-20 w-6/12">
        {/* Header */}
        <Box className="flex flex-col space-y-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Join the {process.env.NEXT_PUBLIC_APP_NAME} community today
          </h3>
          <span className="text-sm text-muted-foreground">
            By continuing, you agree to our&nbsp;
            <Link
              className="text-card-foreground"
              href="/policies/user-agreement"
              size="sm"
            >
              User Agreement
            </Link>
            &nbsp;and acknowledge that you understand our&nbsp;
            <Link
              className="text-card-foreground"
              href="/policies/privacy-policy"
              size="sm"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </Box>

        {/* Body */}
        <Box className="space-y-6 pt-0 flex-col w-full">
          <Form {...form}>
            <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <TextField
                  label="Email"
                  name="email"
                  placeholder="you@example.com"
                />
                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <Button className="w-full" type="submit">
                Create account
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleLogin onSuccess={() => console.log("")} text="signup_with" />
        </Box>

        {/* Login button */}
        <div className="flex gap-x-2 w-full justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Link href="/login" size="sm">
            Login
          </Link>
        </div>
      </Box>

      <Box className="flex w-6/12 bg-primary" />
    </Box>
  );
}

export default RegisterPage;
