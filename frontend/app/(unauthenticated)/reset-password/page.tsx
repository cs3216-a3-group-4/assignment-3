"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Box } from "@/components/ui/box";

import ResetPasswordCompleteForm from "./_components/reset-password-complete-form";
import ResetPasswordCompleteSent from "./_components/reset-password-complete-sent";
import ResetPasswordCreateRequestForm from "./_components/reset-password-create-request-form";

enum ResetPasswordState {
  CreatingRequest,
  PendingReset,
  End,
}

function ResetPasswordPage() {
  const params = useSearchParams();

  const code = params.get("code");

  const [pageState, setPageState] = useState<ResetPasswordState>(
    code ? ResetPasswordState.PendingReset : ResetPasswordState.CreatingRequest,
  );

  return (
    <Box className="flex flex-col m-auto w-full justify-center items-center gap-y-6">
      {pageState === ResetPasswordState.CreatingRequest && (
        <ResetPasswordCreateRequestForm />
      )}
      {pageState === ResetPasswordState.PendingReset && (
        <ResetPasswordCompleteForm
          code={code!}
          onComplete={() => setPageState(ResetPasswordState.End)}
        />
      )}
      {pageState === ResetPasswordState.End && <ResetPasswordCompleteSent />}
    </Box>
  );
}

export default ResetPasswordPage;
