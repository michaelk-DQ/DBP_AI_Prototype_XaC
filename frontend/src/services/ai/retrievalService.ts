import servicesJson from "../../data/services.json";
import coursesJson from "../../data/courses.json";
import eventsJson from "../../data/events.json";
import type {
  CourseRecord,
  EventRecord,
  LearningFilters,
  ServiceFilters,
  ServiceRecord,
} from "../../types/knowledge";
import type { UserRecommendationContext } from "../../types/user";

interface DatasetFile<T> {
  records: T[];
}

function asRecords<T>(data: unknown, label: string): T[] {
  if (
    typeof data === "object" &&
    data !== null &&
    "records" in data &&
    Array.isArray((data as DatasetFile<T>).records)
  ) {
    return (data as DatasetFile<T>).records;
  }
  console.warn(`[retrievalService] Invalid ${label} dataset — using empty list`);
  return [];
}

const services = asRecords<ServiceRecord>(servicesJson, "services");
const courses = asRecords<CourseRecord>(coursesJson, "courses");
const events = asRecords<EventRecord>(eventsJson, "events");

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function asStringArray(value: string[] | undefined | null): string[] {
  return Array.isArray(value) ? value : [];
}

function matchesQuery(text: string, query?: string): boolean {
  if (!query?.trim()) return true;
  return normalize(text).includes(normalize(query));
}

function matchesStage(stages: string[] | undefined, stage?: string): boolean {
  const safeStages = asStringArray(stages);
  if (!stage || stage === "Exploration") return true;
  return safeStages.some((s) => normalize(s) === normalize(stage));
}

export function getAllServices(): ServiceRecord[] {
  return services;
}

export function getAllCourses(): CourseRecord[] {
  return courses;
}

export function getAllEvents(): EventRecord[] {
  return events;
}

export function getServiceCategories(): string[] {
  return [...new Set(services.map((s) => s.service_category).filter(Boolean))].sort();
}

export function getBusinessStages(): string[] {
  const stages = new Set<string>();
  for (const s of services) {
    asStringArray(s.target_business_stage).forEach((st) => stages.add(st));
  }
  for (const c of courses) {
    asStringArray(c.business_stage).forEach((st) => stages.add(st));
  }
  for (const e of events) {
    asStringArray(e.business_stage).forEach((st) => stages.add(st));
  }
  return [...stages].sort();
}

export function searchServices(filters: ServiceFilters = {}): ServiceRecord[] {
  return services.filter((service) => {
    const tags = asStringArray(service.tags).join(" ");
    const haystack = [
      service.service_name ?? "",
      service.service_description ?? "",
      service.service_category ?? "",
      service.searchable_content ?? "",
      tags,
    ].join(" ");

    if (!matchesQuery(haystack, filters.query)) return false;
    if (
      filters.category &&
      normalize(service.service_category ?? "") !== normalize(filters.category)
    ) {
      return false;
    }
    if (!matchesStage(service.target_business_stage, filters.businessStage)) {
      return false;
    }
    return true;
  });
}

export function searchLearning(filters: LearningFilters = {}): {
  courses: CourseRecord[];
  events: EventRecord[];
} {
  const courseResults = courses.filter((course) => {
    const haystack = [
      course.course_title ?? "",
      course.course_description ?? "",
      course.category_stream ?? "",
      course.searchable_content ?? "",
      asStringArray(course.tags).join(" "),
    ].join(" ");

    if (!matchesQuery(haystack, filters.query)) return false;
    if (!matchesStage(course.business_stage, filters.businessStage)) return false;
    if (
      filters.capability &&
      normalize(course.category_stream ?? "") !== normalize(filters.capability)
    ) {
      return false;
    }
    return true;
  });

  const eventResults = events.filter((event) => {
    const haystack = [
      event.event_title ?? "",
      event.event_description ?? "",
      event.capability ?? "",
      event.searchable_content ?? "",
      asStringArray(event.tags).join(" "),
    ].join(" ");

    if (!matchesQuery(haystack, filters.query)) return false;
    if (!matchesStage(event.business_stage, filters.businessStage)) return false;
    if (
      filters.capability &&
      normalize(event.capability ?? "") !== normalize(filters.capability)
    ) {
      return false;
    }
    return true;
  });

  return { courses: courseResults, events: eventResults };
}

function scoreTags(itemTags: string[] | undefined, profileTags: string[]): number {
  const safeItemTags = asStringArray(itemTags);
  const normalizedProfile = asStringArray(profileTags).map(normalize);

  return safeItemTags.reduce((score, tag) => {
    const t = normalize(tag);
    if (normalizedProfile.some((p) => p.includes(t) || t.includes(p))) {
      return score + 2;
    }
    return score;
  }, 0);
}

export function retrieveForUser(
  context: UserRecommendationContext,
  limit = 3
): {
  services: ServiceRecord[];
  courses: CourseRecord[];
  events: EventRecord[];
} {
  try {
    const stage =
      context.businessStage === "Exploration" ? undefined : context.businessStage;
    const profileTags = asStringArray(context.recommendedTags);

    const rankedServices = searchServices({ businessStage: stage })
      .map((item) => ({ item, score: scoreTags(item.tags, profileTags) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.item);

    const { courses: rankedCourses, events: rankedEvents } = searchLearning({
      businessStage: stage,
    });

    const topCourses = rankedCourses
      .map((item) => ({ item, score: scoreTags(item.tags, profileTags) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.item);

    const topEvents = rankedEvents
      .map((item) => ({ item, score: scoreTags(item.tags, profileTags) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.item);

    return {
      services: rankedServices,
      courses: topCourses,
      events: topEvents,
    };
  } catch (error) {
    console.error("[retrievalService] retrieveForUser failed", error);
    return { services: [], courses: [], events: [] };
  }
}

export function findBySlug(
  domain: "service" | "course" | "event",
  slug: string
): ServiceRecord | CourseRecord | EventRecord | undefined {
  if (domain === "service") return services.find((s) => s.slug === slug);
  if (domain === "course") return courses.find((c) => c.slug === slug);
  return events.find((e) => e.slug === slug);
}
