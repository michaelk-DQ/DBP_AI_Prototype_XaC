import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/navigation/AppSidebar";
import { MobileNav } from "../components/navigation/MobileNav";
import { ProfileSwitcher } from "../components/navigation/ProfileSwitcher";
import { PageErrorBoundary } from "../components/layout/PageErrorBoundary";
import { useCurrentUser, useIsAuthenticated } from "../store/authStore";
import { Badge } from "../components/ui/badge";

export function AppLayout() {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="font-semibold">DBP AI</span>
            <Badge className="bg-violet-100 text-violet-800">Prototype</Badge>
          </div>
          <div className="hidden text-sm text-muted-foreground lg:block">
            {isAuthenticated ? (
              <>
                Signed in as <span className="font-medium text-foreground">{user.displayName}</span>
                <span className="mx-2">·</span>
                {user.businessStage} · {user.industry}
              </>
            ) : (
              "Guest mode — explore freely or use Demo login"
            )}
          </div>
          <ProfileSwitcher />
        </header>
        <main className="flex-1 overflow-auto p-4 pb-24 sm:p-6 lg:pb-6">
          <PageErrorBoundary>
            <Outlet />
          </PageErrorBoundary>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
