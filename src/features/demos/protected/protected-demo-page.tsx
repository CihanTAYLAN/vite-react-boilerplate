import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clearAuthData, getAccessToken, getRefreshToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

function formatTokenPreview(token: string | null): string {
  if (!token) {
    return "missing";
  }

  if (token.length <= 72) {
    return token;
  }

  return `${token.slice(0, 36)}...${token.slice(-24)} (${token.length} chars)`;
}

export function ProtectedDemoPage() {
  const navigate = useNavigate();
  const userEmail = useAuthStore((state) => state.userEmail);
  const clearAuthentication = useAuthStore(
    (state) => state.clearAuthentication,
  );

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  const handleLogout = (): void => {
    clearAuthData();
    clearAuthentication();
    navigate("/");
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>You are authenticated</CardTitle>
        <CardDescription>
          This page is protected by token existence check in route wrapper.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
          Access granted because <code>accessToken</code> exists in
          localStorage.
        </div>

        <div className="space-y-2 rounded-md border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm">
            User email: <strong>{userEmail ?? "Not available"}</strong>
          </p>
          <p className="text-sm">Access token:</p>
          <p className="rounded-md bg-slate-100 p-2 text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <code className="block break-all">
              {formatTokenPreview(accessToken)}
            </code>
          </p>
          <p className="text-sm">Refresh token:</p>
          <p className="rounded-md bg-slate-100 p-2 text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <code className="block break-all">
              {formatTokenPreview(refreshToken)}
            </code>
          </p>
        </div>

        <Button variant="destructive" onClick={handleLogout}>
          Logout and Return Home
        </Button>
      </CardContent>
    </Card>
  );
}
