import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { resendVerificationEmailAuthEmailVerificationPost } from "@/client";
import { toast } from "@/hooks/use-toast";

const UnverifiedAlert = () => {
  const onClickResendVerification = async () => {
    const response = await resendVerificationEmailAuthEmailVerificationPost();
    if (response.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Error while resending a new verification email. Please try again"
        });
        console.error("Error while sending new verification email: ", response.error);
    }
  };

  return (
    <Alert
      className="alert alert-warning w-full my-2 flex items-center space-x-2"
      role="alert"
      variant="destructive"
    >
    <div className="flex items-center">
      <CircleAlert className="h-5 w-5 stroke-red-500" />
    </div>
      <div className="flex flex-col items-start justify-center w-full">
        <AlertTitle>Email verification</AlertTitle>
        <AlertDescription>
            Please verify your email address with the link sent
            to your email. <br />
            Didn't receive the email?{" "}
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
