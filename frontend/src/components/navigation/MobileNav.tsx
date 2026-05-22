import { NavLink } from "react-router-dom";
import { Bookmark, Compass, LayoutDashboard, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/recommendations", icon: Sparkles, label: "AI" },
  { to: "/concierge", icon: MessageSquare, label: "Chat" },
  { to: "/discover", icon: Compass, label: "Find" },
  { to: "/saved", icon: Bookmark, label: "Saved" },
] as const;

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur lg:hidden">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
              isActive ? "text-violet-600" : "text-muted-foreground"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
