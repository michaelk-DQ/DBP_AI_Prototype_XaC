export type KnowledgeDomain = "service" | "course" | "event" | "faq";

export interface ServiceRecord {
  service_name: string;
  slug: string;
  service_description: string;
  service_category: string;
  service_sub_category: string | null;
  provider_name: string;
  tags: string[];
  target_business_stage: string[];
  searchable_content: string;
}

export interface CourseRecord {
  course_title: string;
  slug: string;
  course_description: string;
  provider: string;
  category_stream: string;
  business_stage: string[];
  delivery_mode: string;
  duration: string;
  cost: string;
  tags: string[];
  searchable_content: string;
}

export interface EventRecord {
  event_title: string;
  slug: string;
  event_description: string;
  event_location: string;
  event_type: string;
  delivery_mode: string;
  capability: string;
  business_stage: string[];
  event_provider: string;
  tags: string[];
  searchable_content: string;
}

export interface ScoredRecommendation<T> {
  item: T;
  domain: KnowledgeDomain;
  score: number;
  whyRecommended: string;
  matchedTags: string[];
}

export interface RecommendationBundle {
  services: ScoredRecommendation<ServiceRecord>[];
  courses: ScoredRecommendation<CourseRecord>[];
  events: ScoredRecommendation<EventRecord>[];
}

export interface ServiceFilters {
  query?: string;
  category?: string;
  businessStage?: string;
}

export interface LearningFilters {
  query?: string;
  businessStage?: string;
  capability?: string;
}

export interface FaqRecord {
  question: string;
  answer: string;
  category?: string;
  section?: string;
  area?: string;
  tags?: string[];
  searchable_content?: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

export interface FaqFilters {
  query?: string;
  category?: string;
}

export interface FaqMatch {
  faq: FaqRecord;
  score: number;
  confidence: "high" | "medium" | "low";
}

export interface GeneralKnowledgeResult {
  answer: string;
  source: "faq" | "services" | "learning" | "fallback";
  category: string;
  confidence: "high" | "medium" | "low";
  relatedFaqs: FaqRecord[];
}
