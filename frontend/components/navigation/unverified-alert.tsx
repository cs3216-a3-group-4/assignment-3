import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UnverifiedAlert = () => {
  const onClickResendVerification = () => {};

  return (
    <Alert
      className="alert alert-warning w-full my-2 flex items-center space-x-2"
      role="alert"
      variant="destructive"
    >
      <div className="flex items-center">
        <CircleAlert className="h-5 w-5 stroke-teal-700" />
      </div>
      <AlertTitle>Email verification</AlertTitle>
      <AlertDescription>
        Please verify your email address by clicking the verification link sent
        to your email. <br />
        <span
          className="underline cursor-pointer"
          onClick={onClickResendVerification}
        >
          Resend
        </span>{" "}
        verification link?
      </AlertDescription>
    </Alert>
  );
};

export default UnverifiedAlert;
