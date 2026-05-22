import { listSwitchableProfiles } from "../../mocks/users/mockProfiles";
import { useAuthStore } from "../../store/authStore";
import type { ProfileId } from "../../types/user";
import { Button } from "../ui/button";

export function ProfileSwitcher() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const switchProfile = useAuthStore((s) => s.switchProfile);
  const logout = useAuthStore((s) => s.logout);

  const profiles = listSwitchableProfiles();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-9 max-w-[200px] rounded-lg border border-input bg-background px-2 text-sm"
        value={currentUser.id}
        onChange={(e) => {
          const id = e.target.value as ProfileId;
          if (id === "guest") logout();
          else switchProfile(id);
        }}
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.displayName}
          </option>
        ))}
      </select>
      {!currentUser.isAuthenticated && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => switchProfile("startup_founder")}
        >
          Demo login
        </Button>
      )}
    </div>
  );
}
