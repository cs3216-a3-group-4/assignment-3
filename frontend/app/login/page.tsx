"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { z } from "zod";

import { logInAuthLoginPost } from "@/client";
import GoogleOAuthButton from "@/components/auth/google-oauth-button";
import PasswordField from "@/components/form/fields/password-field";
import TextField from "@/components/form/fields/text-field";
import Link from "@/components/navigation/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useUserStore } from "@/store/user/user-store-provider";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

const loginFormDefault = {
  email: "",
  password: "",
};

type LoginForm = z.infer<typeof loginFormSchema>;

function LoginPage() {
  const router = useRouter();
  const setLoggedIn = useUserStore((state) => state.setLoggedIn);
  const [isError, setIsError] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefault,
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await logInAuthLoginPost({
      body: { username: data.email, password: data.password },
      withCredentials: true,
    });

    if (response.error) {
      setIsError(true);
    } else {
      setIsError(false);
      const { id: userId, email } = response.data.user;
      setLoggedIn(userId, email);
      router.push("/");
    }
  };

  return (
    <Box className="flex flex-col m-auto w-full justify-center items-center gap-y-6">
      <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:max-w-lg">
        <CardHeader className="space-y-3">
          <CardTitle>Log in to {process.env.NEXT_PUBLIC_APP_NAME}</CardTitle>
          <CardDescription>
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
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Box className="space-y-6">
            {isError && (
              <Alert variant="destructive">
                <CircleAlert className="h-5 w-5" />
                <AlertDescription>
                  Your email or password is incorrect. Please try again, or{" "}
                  <Link href="/user/password-reset" size="sm">
                    reset your password
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                className="space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-4">
                  <TextField label="Email" name="email" />
                  <PasswordField label="Password" name="password" />
                </div>
                <Button className="w-full" type="submit">
                  Log in
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
        </CardContent>
      </Card>
      <div className="flex gap-x-2 w-full justify-center">
        <p className="text-sm text-muted-foreground">Not registered yet?</p>
        <Link href="/register" size="sm">
          Create an account
        </Link>
      </div>
    </Box>
  );
}

export default LoginPage;
