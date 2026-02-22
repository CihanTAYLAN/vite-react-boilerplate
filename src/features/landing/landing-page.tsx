import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const featureHighlights = [
  "React Router nested and protected routes",
  "Zustand global state with persistence",
  "SWR data fetching, caching, and revalidation",
  "react-hook-form + zod form validation",
  "Token-based authentication helpers",
  "Runtime configuration via window.__ENV__",
  "Dockerized static deployment with Nginx",
];

const quickLinks = [
  { href: "/demo/routing", label: "Routing Demo" },
  { href: "/demo/state", label: "State Demo" },
  { href: "/demo/requests", label: "Requests Demo" },
  { href: "/demo/forms", label: "Forms Demo" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Register" },
  { href: "/demo/protected", label: "Protected Page" },
];

export function LandingPage() {
  return (
    <section className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4 bg-[linear-gradient(90deg,var(--color-hero-from),var(--color-hero-via),var(--color-hero-to))]">
          <span className="inline-flex w-fit rounded-full border border-[var(--color-badge-border)] bg-[var(--color-badge-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-badge-text)]">
            Production-Ready Starter Kit
          </span>
          <CardTitle className="max-w-3xl text-3xl md:text-4xl">
            Static React SPA foundation with runtime configuration, auth
            patterns, and Docker delivery.
          </CardTitle>
          <CardDescription className="max-w-3xl text-base">
            This template demonstrates enterprise-ready frontend architecture
            where the same Docker image can be reused across environments by
            injecting runtime env values into <code>/env.js</code> at container
            startup.
          </CardDescription>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/demo/routing">Explore Demos</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth/login">Go to Login</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {featureHighlights.map((feature) => (
          <Card key={feature}>
            <CardContent className="pt-6">
              <p className="font-medium">{feature}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demo Navigation</CardTitle>
          <CardDescription>
            Each page focuses on one core concern of the stack.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Button key={link.href} variant="secondary" asChild>
              <Link to={link.href}>{link.label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
