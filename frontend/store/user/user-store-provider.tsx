import { createContext, ReactNode, useContext, useRef } from "react";
import { StoreApi, useStore } from "zustand";

import { createUserStore, UserStore } from "@/store/user/user-store";

export type UserStoreApi = StoreApi<UserStore>;
export const UserStoreContext = createContext<UserStoreApi | null>(null);

export const UserStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<UserStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
