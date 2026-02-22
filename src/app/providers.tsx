import { useEffect, type PropsWithChildren } from "react";
import { SWRConfig } from "swr";

import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";

function ThemeSync(): null {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}

function AuthSync(): null {
  const syncFromStorage = useAuthStore((state) => state.syncFromStorage);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        revalidateOnFocus: true,
        dedupingInterval: 3_000,
      }}
    >
      <ThemeSync />
      <AuthSync />
      {children}
    </SWRConfig>
  );
}
