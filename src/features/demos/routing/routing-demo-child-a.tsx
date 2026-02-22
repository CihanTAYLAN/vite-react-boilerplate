import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RoutingDemoChildA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Route: Child A</CardTitle>
        <CardDescription>
          Child routes can have their own components while sharing parent layout
          and navigation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          This route can host feature-specific state or data loaders independent
          from sibling routes.
        </p>
      </CardContent>
    </Card>
  );
}
