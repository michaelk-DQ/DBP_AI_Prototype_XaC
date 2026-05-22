import {
  getAllCourses,
  getAllEvents,
  getAllServices,
} from "./retrievalService";
import type {
  CourseRecord,
  EventRecord,
  RecommendationBundle,
  ScoredRecommendation,
  ServiceRecord,
} from "../../types/knowledge";
import type { UserRecommendationContext } from "../../types/user";

const EMPTY_BUNDLE: RecommendationBundle = {
  services: [],
  courses: [],
  events: [],
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function asArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function scoreItem(
  tags: string[] | undefined,
  stages: string[] | undefined,
  context: UserRecommendationContext,
  capability?: string
): { score: number; matchedTags: string[]; reasons: string[] } {
  const safeTags = asArray(tags);
  const safeStages = asArray(stages);
  const profileTags = asArray(context.recommendedTags);
  const interests = asArray(context.interests);
  const capabilities = asArray(context.preferredCapabilities);

  let score = 0;
  const matchedTags: string[] = [];
  const reasons: string[] = [];

  for (const tag of safeTags) {
    const t = normalize(tag);
    for (const profileTag of profileTags) {
      const p = normalize(profileTag);
      if (t.includes(p) || p.includes(t)) {
        score += 3;
        matchedTags.push(tag);
        break;
      }
    }
  }

  for (const interest of interests) {
    const i = normalize(interest);
    if (
      safeTags.some((tag) => normalize(tag).includes(i) || i.includes(normalize(tag)))
    ) {
      score += 2;
      reasons.push(`Matches your interest in ${interest}`);
    }
  }

  if (
    context.businessStage !== "Exploration" &&
    safeStages.some((s) => normalize(s) === normalize(context.businessStage))
  ) {
    score += 4;
    reasons.push(`Aligned with your ${context.businessStage} stage`);
  }

  if (
    capability &&
    capabilities.some(
      (c) =>
        normalize(c) === normalize(capability) ||
        normalize(c).includes(normalize(capability))
    )
  ) {
    score += 3;
    reasons.push("Matches preferred capability area");
  }

  if (normalize(context.industry) !== "general") {
    const industry = normalize(context.industry);
    const token = industry.split(" ")[0] ?? industry;
    if (safeTags.some((tag) => normalize(tag).includes(token))) {
      score += 2;
      reasons.push(`Relevant to ${context.industry}`);
    }
  }

  return { score, matchedTags: [...new Set(matchedTags)], reasons };
}

function buildWhy(reasons: string[], matchedTags: string[]): string {
  if (reasons.length > 0) return reasons.slice(0, 2).join(". ");
  if (matchedTags.length > 0) {
    return `Matches your profile tags: ${matchedTags.slice(0, 3).join(", ")}`;
  }
  return "Suggested based on your entrepreneur profile and ecosystem goals.";
}

function rankServices(
  context: UserRecommendationContext
): ScoredRecommendation<ServiceRecord>[] {
  return getAllServices()
    .map((item) => {
      const { score, matchedTags, reasons } = scoreItem(
        item.tags,
        item.target_business_stage,
        context,
        item.service_category
      );
      return {
        item,
        domain: "service" as const,
        score,
        matchedTags,
        whyRecommended: buildWhy(reasons, matchedTags),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function rankCourses(
  context: UserRecommendationContext
): ScoredRecommendation<CourseRecord>[] {
  return getAllCourses()
    .map((item) => {
      const { score, matchedTags, reasons } = scoreItem(
        item.tags,
        item.business_stage,
        context,
        item.category_stream
      );
      return {
        item,
        domain: "course" as const,
        score,
        matchedTags,
        whyRecommended: buildWhy(reasons, matchedTags),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function rankEvents(
  context: UserRecommendationContext
): ScoredRecommendation<EventRecord>[] {
  return getAllEvents()
    .map((item) => {
      const { score, matchedTags, reasons } = scoreItem(
        item.tags,
        item.business_stage,
        context,
        item.capability
      );
      return {
        item,
        domain: "event" as const,
        score,
        matchedTags,
        whyRecommended: buildWhy(reasons, matchedTags),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function getRecommendations(
  context: UserRecommendationContext,
  limitPerDomain = 6
): RecommendationBundle {
  try {
    return {
      services: rankServices(context).slice(0, limitPerDomain),
      courses: rankCourses(context).slice(0, limitPerDomain),
      events: rankEvents(context).slice(0, limitPerDomain),
    };
  } catch (error) {
    console.error("[recommendationEngine] getRecommendations failed", error);
    return EMPTY_BUNDLE;
  }
}

export function getRecommendationSummary(context: UserRecommendationContext): string {
  try {
    const bundle = getRecommendations(context, 2);
    const total =
      bundle.services.length + bundle.courses.length + bundle.events.length;

    if (total === 0) {
      return "Explore the ecosystem to build your personalized recommendation feed.";
    }

    return `${total} tailored matches across services, courses, and events for your ${context.businessStage} journey.`;
  } catch {
    return "Personalized recommendations will appear once your profile is loaded.";
  }
}
