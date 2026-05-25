import {
  retrieveForUser,
  retrieveGeneralKnowledge,
  searchLearning,
  searchServices,
} from "./retrievalService";
import type { UserRecommendationContext } from "../../types/user";

export interface ConciergeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ConciergeResponse {
  message: ConciergeMessage;
  retrievedCount: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildServiceAnswer(context: UserRecommendationContext): string {
  const results = searchServices({ businessStage: context.businessStage === "Exploration" ? undefined : context.businessStage }).slice(0, 3);

  if (results.length === 0) {
    return "I could not find matching services right now. Try the Discover page to browse the full catalog.";
  }

  const list = results
    .map((s) => `• **${s.service_name}** — ${s.service_description.slice(0, 120)}…`)
    .join("\n");

  return `Here are services that may fit your profile:\n\n${list}\n\nVisit **Discover** for filters and search.`;
}

function buildLearningAnswer(context: UserRecommendationContext): string {
  const { courses, events } = searchLearning({
    businessStage: context.businessStage === "Exploration" ? undefined : context.businessStage,
  });

  const topCourses = courses.slice(0, 2);
  const topEvents = events.slice(0, 2);

  const parts: string[] = [];

  if (topCourses.length) {
    parts.push(
      "**Courses:**\n" +
        topCourses.map((c) => `• ${c.course_title} (${c.duration}, ${c.cost})`).join("\n")
    );
  }

  if (topEvents.length) {
    parts.push(
      "**Events:**\n" +
        topEvents.map((e) => `• ${e.event_title} — ${e.event_location}`).join("\n")
    );
  }

  if (!parts.length) {
    return "Browse the **Learning** page for upcoming events and courses in the UAE SME ecosystem.";
  }

  return `${parts.join("\n\n")}\n\nOpen **Browse** for full listings and filters.`;
}

function buildPersonalizedGreeting(context: UserRecommendationContext): string {
  const retrieved = retrieveForUser(context, 2);
  const count =
    retrieved.services.length + retrieved.courses.length + retrieved.events.length;

  return (
    `Hello! I'm your DBP concierge. Based on your **${context.businessStage}** profile in **${context.industry}**, ` +
    `I found ${count} relevant ecosystem items. Ask about services, funding programs, events, or courses.`
  );
}

function routeMockResponse(
  prompt: string,
  context: UserRecommendationContext
): string {
  const q = prompt.toLowerCase();

  // FAQ / general knowledge — runs first, highest priority
  const knowledge = retrieveGeneralKnowledge(prompt);
  if (knowledge.source === "faq" && knowledge.confidence !== "low") {
    const related = knowledge.relatedFaqs.length
      ? `\n\nRelated topics: ${knowledge.relatedFaqs.map((f) => `• ${f.question}`).join("\n")}`
      : "";
    return `${knowledge.answer}${related}`;
  }

  if (q.includes("service") || q.includes("support") || q.includes("program")) {
    return buildServiceAnswer(context);
  }

  if (
    q.includes("course") ||
    q.includes("event") ||
    q.includes("learn") ||
    q.includes("workshop") ||
    q.includes("training")
  ) {
    return buildLearningAnswer(context);
  }

  if (q.includes("recommend") || q.includes("suggest") || q.includes("personal")) {
    const retrieved = retrieveForUser(context, 2);
    const goals = context.goals ?? [];
    return (
      `For your goals (${goals.slice(0, 2).join(", ") || "ecosystem growth"}), I recommend:\n\n` +
      (retrieved.services[0]
        ? `• Service: **${retrieved.services[0].service_name}**\n`
        : "") +
      (retrieved.courses[0]
        ? `• Course: **${retrieved.courses[0].course_title}**\n`
        : "") +
      (retrieved.events[0]
        ? `• Event: **${retrieved.events[0].event_title}**\n`
        : "") +
      `\nSign in with a demo profile on the **Dashboard** for richer recommendations.`
    );
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("help")) {
    return buildPersonalizedGreeting(context);
  }

  // Low-confidence FAQ fallback — still surface it
  if (knowledge.source !== "fallback") {
    return knowledge.answer;
  }

  return (
    `I can help you navigate the UAE business ecosystem — services, events, and courses. ` +
    `Try asking: "What services support growth stage SMEs?" or "Recommend courses for my profile."`
  );
}

export async function sendConciergeMessage(
  prompt: string,
  context: UserRecommendationContext
): Promise<ConciergeResponse> {
  await delay(600 + Math.random() * 400);

  const retrieved = retrieveForUser(context, 5);
  const retrievedCount =
    retrieved.services.length + retrieved.courses.length + retrieved.events.length;

  const content = routeMockResponse(prompt, context);

  return {
    message: {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      timestamp: Date.now(),
    },
    retrievedCount,
  };
}

export function getConciergeWelcome(context: UserRecommendationContext): ConciergeMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: buildPersonalizedGreeting(context),
    timestamp: Date.now(),
  };
}
