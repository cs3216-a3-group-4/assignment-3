"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { z } from "zod";

import { signUpAuthSignupPost } from "@/client";
import GoogleOAuthButton from "@/components/auth/google-oauth-button";
import PasswordField from "@/components/form/fields/password-field";
import TextField from "@/components/form/fields/text-field";
import Link from "@/components/navigation/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserStore } from "@/store/user/user-store-provider";

const registerFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters"),
});

const registerFormDefault = {
  email: "",
  password: "",
};

type RegisterForm = z.infer<typeof registerFormSchema>;

function RegisterPage() {
  const router = useRouter();
  const setLoggedIn = useUserStore((state) => state.setLoggedIn);
  const [isError, setIsError] = useState<boolean>(false);
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefault,
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    const response = await signUpAuthSignupPost({
      body: { ...data },
      withCredentials: true,
    });

    if (response.error) {
      setIsError(true);
    } else {
      setIsError(false);
      setLoggedIn(response.data.user);
      router.push("/onboarding");
    }
  };

  return (
    <Box className="flex flex-col m-auto w-full justify-center items-center gap-y-6 md:bg-primary min-h-full">
      <Box className="flex flex-col space-y-8 justify-center items-center bg-card text-card-foreground px-6 sm:px-12 py-3 md:py-6 md:max-w-lg border-0 md:border rounded-lg shadow-sm">
        {/* Header */}
        <Box className="flex flex-col space-y-3">
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
          {isError && (
            <Alert
              className="flex flex-row items-center gap-x-2"
              variant="destructive"
            >
              <div className="flex flex-row">
                <CircleAlert className="h-5 w-5" />
              </div>
              <AlertDescription>
                This email is already registered.{" "}
                <Link href="/login" size="sm">
                  Sign in
                </Link>{" "}
                instead?
              </AlertDescription>
            </Alert>
          )}
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
                  placeholder="Minimum 6 characters"
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

          <div>
            <GoogleOAuthButton />
          </div>
        </Box>

        {/* Login button */}
        <div className="flex gap-x-2 w-full justify-center items-baseline">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Link href="/login" size="sm">
            Login
          </Link>
        </div>
      </Box>
    </Box>
  );
}

export default RegisterPage;
