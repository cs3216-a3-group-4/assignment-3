import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordCompleteSent() {
  return (
    <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:w-[32em] md:max-w-lg">
      <CardHeader className="space-y-3">
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          All done! Login with your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckCircleIcon className="w-24 h-24 m-auto stroke-muted-foreground mt-4" />
        <div className="mt-8 m-auto flex">
          <Link className="w-full" href="/login">
            <Button className="w-full">Proceed to Login</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
