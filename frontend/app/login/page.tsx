"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PasswordField from "@/components/form/fields/password-field";
import TextField from "@/components/form/fields/text-field";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

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
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefault,
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => console.log(data);

  return (
    <Card className="flex flex-col m-auto w-full lg:max-w-md">
      <CardHeader>
        <CardTitle>Log in to {process.env.NEXT_PUBLIC_APP_NAME}</CardTitle>
        <CardDescription>
          Welcome back, let&apos;s get you signed in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <TextField label="Email" name="email" />
              <PasswordField label="Password" name="password" />
            </div>
            <Button className="w-full" type="submit">
              Log in
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <div className="flex gap-x-2">
          <p className="text-sm text-muted-foreground">Not registered yet?</p>
          <Link href="/register" size="sm">
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
