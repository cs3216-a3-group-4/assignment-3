"use client";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/user/user-store-provider";

export default function RedirectIfAuthenticated({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  if (isLoggedIn) {
    router.push("/");
  }
  return children;
}
