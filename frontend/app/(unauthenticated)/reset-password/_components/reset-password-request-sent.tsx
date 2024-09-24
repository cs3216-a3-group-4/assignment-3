import { CheckCircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordRequestSent() {
  return (
    <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:max-w-lg">
      <CardHeader className="space-y-3">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          If your account exists, a password reset link will reach your email
          soon!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckCircleIcon className="w-24 h-24 m-auto stroke-muted-foreground" />
      </CardContent>
    </Card>
  );
}
