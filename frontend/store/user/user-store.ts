import { createStore } from "zustand";

import { UserPublic } from "@/client";

interface UserState {
  isFetching: boolean;
  isLoggedIn: boolean;
  user?: UserPublic;
}

export const defaultUserState: UserState = {
  isLoggedIn: false,
  isFetching: false,
};

interface UserActions {
  setIsFetching: () => void;
  setIsNotFetching: () => void;
  setLoggedIn: (user: UserPublic) => void;
  setNotLoggedIn: () => void;
  setIsUserVerified: (verfied: boolean, tierId: number) => void;
}

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setIsFetching: () => set((store) => ({ ...store, isFetching: true })),
    setIsNotFetching: () => set((store) => ({ ...store, isFetching: false })),
    setLoggedIn: (user) => set(() => ({ isLoggedIn: true, user })),
    setNotLoggedIn: () =>
      set(() => ({
        isLoggedIn: false,
        user: undefined,
      })),
    setIsUserVerified: (verified: boolean, tierId: number) =>
      set((store) => {
        const user = store.user;
        if (user) {
          user.verified = verified;
          user.tier_id = tierId;
        }
        return { ...store, user };
      }),
  }));
};
