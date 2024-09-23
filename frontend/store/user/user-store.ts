import { createStore } from "zustand";

import { UserPublic } from "@/client";

interface UserState {
  isLoggedIn: boolean;
  user?: UserPublic;
}

export const defaultUserState: UserState = {
  isLoggedIn: false,
};

interface UserActions {
  setLoggedIn: (user: UserPublic) => void;
  setNotLoggedIn: () => void;
}

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setLoggedIn: (user) => set(() => ({ isLoggedIn: true, user })),
    setNotLoggedIn: () =>
      set(() => ({
        isLoggedIn: false,
        user: undefined,
      })),
  }));
};
