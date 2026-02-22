import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-[var(--color-secondary)] border-t-[var(--color-primary)]",
        className,
      )}
      aria-hidden="true"
    />
  );
}
