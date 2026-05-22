import { NavLink } from "react-router-dom";
import {
  Bookmark,
  Compass,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useIsAuthenticated } from "../../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, auth: true },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles, auth: true },
  { to: "/saved", label: "Saved", icon: Bookmark, auth: true },
  { to: "/concierge", label: "Concierge", icon: MessageSquare, auth: false },
  { to: "/discover", label: "Discover", icon: Compass, auth: false },
  { to: "/browse", label: "Browse", icon: GraduationCap, auth: false },
] as const;

export function AppSidebar() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar lg:block">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
          <Sparkles size={16} />
        </div>
        <span className="font-semibold">DBP AI</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon, auth }) => {
          const locked = auth && !isAuthenticated;
          return (
            <NavLink
              key={to}
              to={locked ? "/concierge" : to}
              title={locked ? "Sign in with a demo profile to access" : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                  locked && "opacity-50"
                )
              }
            >
              <Icon size={18} />
              {label}
              {locked && (
                <span className="ml-auto text-[10px] uppercase text-muted-foreground">
                  Login
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
