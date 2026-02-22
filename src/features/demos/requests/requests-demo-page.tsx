import useSWR from "swr";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getHealth,
  type ApiError,
  type HealthResponse,
} from "@/lib/api-client";
import { getEnvConfig } from "@/lib/env";

export function RequestsDemoPage() {
  const { API_BASE_URL } = getEnvConfig();
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    HealthResponse,
    ApiError
  >("health-check", getHealth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SWR Request + Cache Demo</CardTitle>
        <CardDescription>
          Request target: <code>{API_BASE_URL}/health</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => mutate()}
            variant="secondary"
            disabled={isValidating}
          >
            {isValidating ? "Revalidating..." : "Revalidate"}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-md border border-slate-200 p-4 dark:border-slate-800">
            <LoadingSpinner />
            <span>Checking API health...</span>
          </div>
        ) : null}

        {error ? (
          <div className="space-y-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            <p>
              Request failed ({error.status || "network"}): {error.message}
            </p>
            <Button variant="destructive" onClick={() => mutate()}>
              Retry
            </Button>
          </div>
        ) : null}

        {data ? (
          <>
            <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="font-medium">
                Status: {String(data.status ?? "unknown")}
              </p>
              <pre className="mt-3 overflow-auto rounded-md bg-[var(--color-code-bg)] p-3 text-xs text-[var(--color-code-text)]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Navigate away and return to this page to observe SWR cache
              behavior.
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
