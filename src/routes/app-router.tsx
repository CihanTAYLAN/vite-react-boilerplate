import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { LoginPage } from "@/features/auth/login-page";
import { RegisterPage } from "@/features/auth/register-page";
import { FormsDemoPage } from "@/features/demos/forms/forms-demo-page";
import { ProtectedDemoPage } from "@/features/demos/protected/protected-demo-page";
import { RequestsDemoPage } from "@/features/demos/requests/requests-demo-page";
import { RoutingDemoChildA } from "@/features/demos/routing/routing-demo-child-a";
import { RoutingDemoChildB } from "@/features/demos/routing/routing-demo-child-b";
import { RoutingDemoHome } from "@/features/demos/routing/routing-demo-home";
import { RoutingDemoLayout } from "@/features/demos/routing/routing-demo-layout";
import { StateDemoPage } from "@/features/demos/state/state-demo-page";
import { LandingPage } from "@/features/landing/landing-page";
import { ProtectedRoute } from "@/routes/protected-route";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "demo/routing",
        element: <RoutingDemoLayout />,
        children: [
          {
            index: true,
            element: <RoutingDemoHome />,
          },
          {
            path: "child-a",
            element: <RoutingDemoChildA />,
          },
          {
            path: "child-b",
            element: <RoutingDemoChildB />,
          },
        ],
      },
      {
        path: "demo/state",
        element: <StateDemoPage />,
      },
      {
        path: "demo/requests",
        element: <RequestsDemoPage />,
      },
      {
        path: "demo/forms",
        element: <FormsDemoPage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "auth/register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "demo/protected",
            element: <ProtectedDemoPage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
