import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setAuthTokens, setAuthUserEmail } from "@/lib/auth";
import { ApiError, login } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from ?? "/demo/protected";

  const onSubmit = async (values: LoginValues): Promise<void> => {
    setApiError(null);

    try {
      const response = await login(values);
      setAuthTokens(response);
      const resolvedEmail = response.user?.email ?? values.email;
      setAuthUserEmail(resolvedEmail);
      setAuthenticated(resolvedEmail);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
        return;
      }

      setApiError("Unexpected error occurred during login.");
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Submits <code>POST /api/v1/common/auth/login</code> and stores
          access/refresh tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError ? (
              <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {apiError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
