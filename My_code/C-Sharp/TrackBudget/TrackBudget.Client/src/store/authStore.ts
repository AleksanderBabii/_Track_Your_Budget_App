import { create } from "zustand";

import { tokenStorage } from "../utils/storage";

import type { AuthUser } from "../types/auth";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setSession: (token: string, user?: AuthUser | null) => void;

  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenStorage.get(),
  user: null,
  isAuthenticated: Boolean(tokenStorage.get()),

  setSession: (token, user = null) => {
    tokenStorage.set(token);

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },
  setUser: (user) => {
    set({
      user,
    });
  },
  logout: () => {
    tokenStorage.remove();

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
