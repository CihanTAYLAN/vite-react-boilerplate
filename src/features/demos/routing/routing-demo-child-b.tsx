import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RoutingDemoChildB() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Route: Child B</CardTitle>
        <CardDescription>
          Route composition keeps concerns isolated while preserving URL-based
          navigation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          You can attach child-level loaders/actions or guard logic as your app
          grows.
        </p>
      </CardContent>
    </Card>
  );
}
