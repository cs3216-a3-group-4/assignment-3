import { CircleAlert } from "lucide-react";

import { resendVerificationEmailAuthEmailVerificationPost } from "@/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const UnverifiedAlert = () => {
  const onClickResendVerification = async () => {
    const response = await resendVerificationEmailAuthEmailVerificationPost();
    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error while resending a new verification email. Please try again",
      });
      console.error(
        "Error while sending new verification email: ",
        response.error,
      );
    }
  };

  return (
    <Alert
      className="alert alert-warning w-full flex items-center p-2 space-x-2 md:p-4 md:space-x-4 rounded-none border-x-0"
      role="alert"
      variant="destructive"
    >
      <div className="flex items-center">
        <CircleAlert className="h-5 w-5 stroke-red-500" />
      </div>
      <div className="flex flex-col items-start justify-center w-full">
        <AlertDescription>
          Verify your email with the link we sent to you. Didn't receive it?{" "}
          <span
            className="underline cursor-pointer"
            onClick={onClickResendVerification}
          >
            Resend
          </span>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default UnverifiedAlert;
