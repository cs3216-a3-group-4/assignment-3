import { createStore } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  userId?: number;
  email?: string;
}

export const defaultUserState: UserState = {
  isLoggedIn: false,
};

interface UserActions {
  setLoggedIn: (userId?: number, email?: string) => void;
  setNotLoggedIn: () => void;
}

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setLoggedIn: (userId, email) =>
      set(() => ({ isLoggedIn: true, userId, email })),
    setNotLoggedIn: () =>
      set(() => ({
        isLoggedIn: false,
        userId: undefined,
        email: undefined,
      })),
  }));
};
