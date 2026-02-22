import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCounterStore } from "@/store/counter-store";
import { useThemeStore } from "@/store/theme-store";

function CounterValue() {
  const count = useCounterStore((state) => state.count);

  return (
    <p className="text-4xl font-bold">
      {count}
      <span className="ml-2 text-sm font-normal text-slate-500">
        shared across components
      </span>
    </p>
  );
}

function CounterMirror() {
  const count = useCounterStore((state) => state.count);

  return (
    <p className="rounded-md border border-dashed border-slate-300 p-3 text-sm dark:border-slate-700">
      Mirror component reading same store value: <strong>{count}</strong>
    </p>
  );
}

export function StateDemoPage() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Zustand Counter</CardTitle>
          <CardDescription>
            Increment/decrement/reset actions with global state updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CounterValue />

          <div className="flex flex-wrap gap-2">
            <Button onClick={decrement} variant="secondary">
              Decrement
            </Button>
            <Button onClick={increment}>Increment</Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>

          <CounterMirror />

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Current raw state: <code>{JSON.stringify({ count })}</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Toggle</CardTitle>
          <CardDescription>
            Light/Dark mode stored in Zustand persist middleware and applied
            globally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Active theme: <strong>{theme}</strong>
          </p>
          <Button onClick={toggleTheme} variant="secondary">
            Toggle Theme
          </Button>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Reload the page and the selected theme remains persisted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
