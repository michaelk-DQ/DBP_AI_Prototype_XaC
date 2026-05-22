import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useIsAuthenticated, useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const loginAs = useAuthStore((s) => s.loginAs);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This page is part of the logged-in experience. Switch to a demo profile
            to explore personalized dashboard, recommendations, and saved items.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => loginAs("startup_founder")}>
              Continue as Startup Founder
            </Button>
            <Button variant="outline" onClick={() => loginAs("growth_sme")}>
              Growth SME
            </Button>
          </div>
          <Link
            to="/concierge"
            className="flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium hover:bg-accent"
          >
            Continue as guest → Concierge
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
