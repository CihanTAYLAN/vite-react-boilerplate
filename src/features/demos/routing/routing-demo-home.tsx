import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RoutingDemoHome() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Route: Overview</CardTitle>
        <CardDescription>
          This index route is rendered as the default child inside the routing
          demo layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Use the tabs above to switch between child routes without leaving the
          parent layout.
        </p>
      </CardContent>
    </Card>
  );
}
