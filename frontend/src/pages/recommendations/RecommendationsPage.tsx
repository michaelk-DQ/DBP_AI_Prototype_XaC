import { PageHeader } from "../../components/layout/PageHeader";
import { RecommendationCard } from "../../components/recommendations/RecommendationCard";
import { useRecommendations } from "../../hooks/useRecommendations";

export function RecommendationsPage() {
  const bundle = useRecommendations();

  return (
    <div>
      <PageHeader
        title="AI Recommendations"
        description="Personalized services, events, and courses based on your mock profile, business stage, and interests."
      />

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Recommended Services</h2>
        {bundle.services.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No service matches yet. Try switching profiles.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bundle.services.map((rec) => (
              <RecommendationCard
                key={rec.item.slug}
                domain="service"
                recommendation={rec}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Recommended Events</h2>
        {bundle.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No event matches for this profile.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bundle.events.map((rec) => (
              <RecommendationCard
                key={rec.item.slug}
                domain="event"
                recommendation={rec}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recommended Courses</h2>
        {bundle.courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No course matches for this profile.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bundle.courses.map((rec) => (
              <RecommendationCard
                key={rec.item.slug}
                domain="course"
                recommendation={rec}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
