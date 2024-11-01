import { LucideMail } from "lucide-react";

import { resendVerificationEmailAuthEmailVerificationPost } from "@/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/user/user-store-provider";

const UnverifiedAlert = () => {
  const user = useUserStore((store) => store.user);

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
    } else {
      toast({
        variant: "default",
        title: "We have resent your verification email!",
        description: `Please click the link sent to ${user?.email} to gain access to Jippy's AI features.`,
      });
    }
  };

  return (
    <Alert
      className="alert alert-warning w-full flex items-center p-2 space-x-4 md:p-4 px-8 rounded-none border-x-0 bg-orange-200 border-0"
      role="alert"
      variant="default"
    >
      <div className="flex items-center">
        <LucideMail className="h-5 w-5 fill-slate-800 stroke-orange-200" />
      </div>
      <div className="flex flex-col items-start justify-center w-full">
        <AlertDescription className="w-full">
          <div className="flex justify-between w-full">
            <div>
              Please verify your email address by clicking the link sent to{" "}
              <span className="font-semibold">{user?.email}</span>
            </div>
            <span
              className="underline cursor-pointer justify-self-end"
              onClick={onClickResendVerification}
            >
              Resend verification email
            </span>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default UnverifiedAlert;
