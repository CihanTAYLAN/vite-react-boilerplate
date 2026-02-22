import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const routeTabs = [
  { to: "/demo/routing", label: "Overview" },
  { to: "/demo/routing/child-a", label: "Child A" },
  { to: "/demo/routing/child-b", label: "Child B" },
];

export function RoutingDemoLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Routing Demo</CardTitle>
          <CardDescription>
            Parent layout with nested child routes using React Router.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {routeTabs.map((routeTab) => (
              <NavLink
                key={routeTab.to}
                to={routeTab.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium",
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-secondary-hover)]",
                  )
                }
                end={routeTab.to === "/demo/routing"}
              >
                {routeTab.label}
              </NavLink>
            ))}
          </div>

          <p className="text-sm text-[var(--color-text-muted)]">
            Current route: <code>{location.pathname}</code>
          </p>

          <Button asChild>
            <Link to="/demo/protected">Open Protected Route</Link>
          </Button>
        </CardContent>
      </Card>

      <Outlet />
    </div>
  );
}
