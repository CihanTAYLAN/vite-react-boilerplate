import { LogOut, MoonStar, SunMedium } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { clearAuthData } from "@/lib/auth";
import { getEnvConfig } from "@/lib/env";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";

const links = [
  { to: "/", label: "Landing" },
  { to: "/demo/routing", label: "Routing" },
  { to: "/demo/state", label: "State" },
  { to: "/demo/requests", label: "Requests" },
  { to: "/demo/forms", label: "Forms" },
  { to: "/demo/protected", label: "Protected" },
  { to: "/auth/login", label: "Login" },
  { to: "/auth/register", label: "Register" },
];

export function AppShell() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuthentication = useAuthStore(
    (state) => state.clearAuthentication,
  );
  const { API_BASE_URL, APP_ENV } = getEnvConfig();

  const handleLogout = (): void => {
    clearAuthData();
    clearAuthentication();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-header-bg)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex whitespace-nowrap rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold leading-none text-[var(--color-primary-foreground)]">
              Runtime Config SPA
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {APP_ENV}
            </span>
          </div>

          <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap md:justify-center">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "shrink-0 rounded-md px-3 py-1.5 text-sm transition",
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-secondary)]",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
            <span className="hidden max-w-56 truncate text-xs text-[var(--color-text-muted)] lg:block">
              API: {API_BASE_URL}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunMedium className="size-4" />
              ) : (
                <MoonStar className="size-4" />
              )}
            </Button>
            {isAuthenticated ? (
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="size-4" />
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
