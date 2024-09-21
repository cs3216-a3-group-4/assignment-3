"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { client } from "@/client";

import { UserStoreProvider } from "./user/user-store-provider";

export function StoreProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  client.setConfig({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreProvider>{children}</UserStoreProvider>
    </QueryClientProvider>
  );
}
