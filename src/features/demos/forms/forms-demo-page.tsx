import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof formSchema>;

export function FormsDemoPage() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const touchedFields = form.formState.touchedFields;
  const watchedValues = form.watch();

  const isTouched = (field: keyof FormValues): boolean =>
    Boolean(touchedFields[field]);

  const onSubmit = async (_values: FormValues): Promise<void> => {
    setSubmitMessage(null);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 800);
    });

    setSubmitMessage("Form submitted successfully. Validation passed.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>react-hook-form + zod</CardTitle>
          <CardDescription>
            Validation messages are shown only after each field is touched.
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
                    <FormDescription>
                      Touched: {isTouched("email") ? "Yes" : "No"}
                    </FormDescription>
                    <FormMessage>
                      {isTouched("email")
                        ? form.formState.errors.email?.message
                        : undefined}
                    </FormMessage>
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
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Touched: {isTouched("password") ? "Yes" : "No"}
                    </FormDescription>
                    <FormMessage>
                      {isTouched("password")
                        ? form.formState.errors.password?.message
                        : undefined}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Touched: {isTouched("confirmPassword") ? "Yes" : "No"}
                    </FormDescription>
                    <FormMessage>
                      {isTouched("confirmPassword")
                        ? form.formState.errors.confirmPassword?.message
                        : undefined}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {submitMessage ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  {submitMessage}
                </p>
              ) : null}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Form Values</CardTitle>
          <CardDescription>
            Current values and touched state are displayed for demo purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="overflow-auto rounded-md bg-[var(--color-code-bg)] p-4 text-xs text-[var(--color-code-text)]">
            {JSON.stringify(watchedValues, null, 2)}
          </pre>
          <pre className="overflow-auto rounded-md bg-[var(--color-code-bg)] p-4 text-xs text-[var(--color-code-text)]">
            {JSON.stringify(touchedFields, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
