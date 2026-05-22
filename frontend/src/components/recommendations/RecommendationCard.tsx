import type {
  CourseRecord,
  EventRecord,
  KnowledgeDomain,
  ScoredRecommendation,
  ServiceRecord,
} from "../../types/knowledge";
import { CourseCard } from "../cards/CourseCard";
import { EventCard } from "../cards/EventCard";
import { ServiceCard } from "../cards/ServiceCard";

interface RecommendationCardProps {
  domain: KnowledgeDomain;
  recommendation: ScoredRecommendation<ServiceRecord | CourseRecord | EventRecord>;
}

export function RecommendationCard({ domain, recommendation }: RecommendationCardProps) {
  if (!recommendation?.item) {
    return null;
  }

  const why = recommendation.whyRecommended ?? "";

  if (domain === "service") {
    return (
      <ServiceCard
        service={recommendation.item as ServiceRecord}
        whyRecommended={why}
      />
    );
  }

  if (domain === "course") {
    return (
      <CourseCard
        course={recommendation.item as CourseRecord}
        whyRecommended={why}
      />
    );
  }

  return (
    <EventCard
      event={recommendation.item as EventRecord}
      whyRecommended={why}
    />
  );
}
