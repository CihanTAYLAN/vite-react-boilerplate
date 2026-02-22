import { create } from "zustand";

import { getAccessToken, getAuthUserEmail } from "@/lib/auth";

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  syncFromStorage: () => void;
  setAuthenticated: (email: string | null) => void;
  clearAuthentication: () => void;
}

function readAuthSnapshot(): Pick<AuthState, "isAuthenticated" | "userEmail"> {
  return {
    isAuthenticated: Boolean(getAccessToken()),
    userEmail: getAuthUserEmail(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readAuthSnapshot(),
  syncFromStorage: () => {
    set(readAuthSnapshot());
  },
  setAuthenticated: (email) => {
    set({
      isAuthenticated: true,
      userEmail: email,
    });
  },
  clearAuthentication: () => {
    set({
      isAuthenticated: false,
      userEmail: null,
    });
  },
}));
