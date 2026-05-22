import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Layers, Sparkles } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { ServiceCard } from "../../components/cards/ServiceCard";
import { CourseCard } from "../../components/cards/CourseCard";
import { EventCard } from "../../components/cards/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  useCurrentUser,
  useProfileId,
  getAuthRecommendationContext,
} from "../../store/authStore";
import { getRecommendationSummary } from "../../services/ai/recommendationEngine";
import { retrieveForUser } from "../../services/ai/retrievalService";
import { useSavedItemsStore } from "../../store/savedItemsStore";
import { useRecommendations } from "../../hooks/useRecommendations";

export function DashboardPage() {
  const user = useCurrentUser();
  const profileId = useProfileId();
  const savedCount = useSavedItemsStore((s) => s.items.length);
  const recommendations = useRecommendations(3);

  const featured = useMemo(() => {
    try {
      return retrieveForUser(getAuthRecommendationContext(), 2);
    } catch {
      return { services: [], courses: [], events: [] };
    }
  }, [profileId]);

  const summary = useMemo(() => {
    try {
      return getRecommendationSummary(getAuthRecommendationContext());
    } catch {
      return "Your personalized dashboard is ready.";
    }
  }, [profileId]);

  const recCount =
    recommendations.services.length +
    recommendations.courses.length +
    recommendations.events.length;

  const interests = user.interests ?? [];
  const goals = user.goals ?? [];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.displayName ?? "Guest"}`}
        description={summary}
        action={
          <Link
            to="/recommendations"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Sparkles size={16} />
            View AI Recommendations
          </Link>
        }
      />

      <Card className="mb-8 border-violet-200 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 dark:from-violet-950/30 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-lg">Your profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Badge>{user.businessStage}</Badge>
          <Badge className="bg-muted">{user.industry}</Badge>
          <Badge className="border border-violet-300 bg-transparent">
            {(user.profileType ?? "guest").replace(/_/g, " ")}
          </Badge>
          {interests.slice(0, 3).map((i) => (
            <Badge key={i} className="bg-muted">
              {i}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="AI Matches"
          value={recCount}
          hint="Personalized for your stage"
          icon={Sparkles}
        />
        <StatCard
          label="Saved Items"
          value={savedCount}
          hint="Services, events & courses"
          icon={BookOpen}
        />
        <StatCard
          label="Business Stage"
          value={user.businessStage}
          icon={Layers}
        />
        <StatCard
          label="Goals"
          value={goals.length}
          hint={goals.slice(0, 2).join(", ") || "—"}
          icon={Calendar}
        />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Featured for you</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.services[0] ? (
            <ServiceCard service={featured.services[0]} />
          ) : null}
          {featured.courses[0] ? (
            <CourseCard course={featured.courses[0]} />
          ) : null}
          {featured.events[0] ? (
            <EventCard event={featured.events[0]} />
          ) : null}
          {!featured.services[0] && !featured.courses[0] && !featured.events[0] && (
            <p className="text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No featured items yet. Switch profiles or explore Discover and Browse.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
