import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { CourseCard } from "../../components/cards/CourseCard";
import { EventCard } from "../../components/cards/EventCard";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  getBusinessStages,
  searchLearning,
} from "../../services/ai/retrievalService";
import { useRecommendations } from "../../hooks/useRecommendations";

const CAPABILITIES = [
  "Business Strategy & Innovation",
  "Finance & Investment",
  "Technology & Digital Systems",
] as const;

export function BrowseLearningPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [capability, setCapability] = useState("");

  const stages = useMemo(() => getBusinessStages(), []);
  const { courses, events } = useMemo(
    () =>
      searchLearning({
        query,
        businessStage: stage || undefined,
        capability: capability || undefined,
      }),
    [query, stage, capability]
  );

  const recommended = useRecommendations(2);

  return (
    <div>
      <PageHeader
        title="Browse Events & Courses"
        description="Explore learning and networking opportunities across the ecosystem."
      />

      {(recommended.courses.length > 0 || recommended.events.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-violet-700">
            Suggested for your profile
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.events[0] ? (
              <EventCard
                event={recommended.events[0].item}
                whyRecommended={recommended.events[0].whyRecommended}
              />
            ) : null}
            {recommended.courses[0] ? (
              <CourseCard
                course={recommended.courses[0].item}
                whyRecommended={recommended.courses[0].whyRecommended}
              />
            ) : null}
          </div>
        </section>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Search events and courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={capability}
          onChange={(e) => setCapability(e.target.value)}
        >
          <option value="">All capabilities</option>
          {CAPABILITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                No events match your filters.
              </p>
            ) : (
              events.map((event) => <EventCard key={event.slug} event={event} />)
            )}
          </div>
        </TabsContent>
        <TabsContent value="courses">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                No courses match your filters.
              </p>
            ) : (
              courses.map((course) => <CourseCard key={course.slug} course={course} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
