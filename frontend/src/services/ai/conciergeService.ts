import {
  retrieveForUser,
  retrieveGeneralKnowledge,
  searchLearning,
  searchServices,
} from "./retrievalService";
import {
  advanceAnonStep,
  anonContextCompleteness,
  createSession,
  extractAnonSignals,
  type AnonCollectedContext,
  type ConversationSession,
} from "./conversationState";
import type { UserRecommendationContext } from "../../types/user";
import type { BusinessStage } from "../../types/user";

// ─── Public types ────────────────────────────────────────────────────────────

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

// ─── Session registry (in-memory, per page mount) ────────────────────────────

let _session: ConversationSession | null = null;

export function initConciergeSession(isAuthenticated: boolean): void {
  _session = createSession(isAuthenticated);
}

function getSession(isAuthenticated: boolean): ConversationSession {
  if (!_session) _session = createSession(isAuthenticated);
  return _session;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeMessage(content: string): ConciergeMessage {
  return { id: crypto.randomUUID(), role: "assistant", content, timestamp: Date.now() };
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

// ─── Shared retrieval builders ────────────────────────────────────────────────

function buildServiceList(context: UserRecommendationContext, limit = 3): string {
  const stage = context.businessStage === "Exploration" ? undefined : context.businessStage;
  const results = searchServices({ businessStage: stage }).slice(0, limit);

  if (!results.length) {
    return "I couldn't find matching services right now. Browse the **Discover** page for the full catalog.";
  }

  const list = results
    .map((s) => `• **${s.service_name}** — ${s.service_description.slice(0, 110)}…`)
    .join("\n");

  return `Here are relevant services:\n\n${list}\n\nVisit **Discover** for filters and full listings.`;
}

function buildLearningList(context: UserRecommendationContext, limit = 2): string {
  const stage = context.businessStage === "Exploration" ? undefined : context.businessStage;
  const { courses, events } = searchLearning({ businessStage: stage });

  const parts: string[] = [];

  if (courses.length) {
    parts.push(
      "**Courses:**\n" +
        courses
          .slice(0, limit)
          .map((c) => `• ${c.course_title} (${c.duration}, ${c.cost})`)
          .join("\n")
    );
  }

  if (events.length) {
    parts.push(
      "**Events:**\n" +
        events
          .slice(0, limit)
          .map((e) => `• ${e.event_title} — ${e.event_location}`)
          .join("\n")
    );
  }

  return parts.length
    ? `${parts.join("\n\n")}\n\nOpen **Browse** for full listings.`
    : "Browse the **Learning** page for upcoming events and courses.";
}

// ─── PATH 01 — AUTHENTICATED ─────────────────────────────────────────────────

function buildAuthWelcome(context: UserRecommendationContext): string {
  const retrieved = retrieveForUser(context, 3);
  const total =
    retrieved.services.length + retrieved.courses.length + retrieved.events.length;

  const topService = retrieved.services[0]?.service_name;
  const topCourse = retrieved.courses[0]?.course_title;

  const highlights: string[] = [];
  if (topService) highlights.push(`**${topService}**`);
  if (topCourse) highlights.push(`**${topCourse}**`);

  const highlightText = highlights.length
    ? ` Top picks include ${highlights.join(" and ")}.`
    : "";

  return (
    `Welcome back, **${context.profileId.replace(/_/g, " ")}**. ` +
    `Based on your **${context.businessStage}** profile in **${context.industry}**, ` +
    `I found **${total}** relevant ecosystem items.${highlightText}\n\n` +
    `Ask me about services, funding, training, or anything on the platform.`
  );
}

function scoreAuthFit(
  context: UserRecommendationContext,
  tags: string[],
  stages: string[]
): number {
  const profileTags = context.recommendedTags.map(normalize);
  const itemTags = tags.map(normalize);
  const itemStages = stages.map(normalize);

  // Sector match 35%
  const industryToken = normalize(context.industry).split(" ")[0] ?? "";
  const sectorHit = itemTags.some((t) => t.includes(industryToken) || industryToken.includes(t));
  const sectorScore = sectorHit ? 35 : 0;

  // Stage match 30%
  const stageHit =
    context.businessStage !== "Exploration" &&
    itemStages.some((s) => s === normalize(context.businessStage));
  const stageScore = stageHit ? 30 : 0;

  // Need overlap 20%
  const tagOverlap = itemTags.filter((t) =>
    profileTags.some((p) => p.includes(t) || t.includes(p))
  ).length;
  const needScore = Math.min(tagOverlap * 5, 20);

  // Membership/history proxy 15% — goals overlap
  const goalKeywords = context.goals.map((g) => normalize(g.replace(/_/g, " ")));
  const goalHit = itemTags.some((t) =>
    goalKeywords.some((g) => g.includes(t) || t.includes(g))
  );
  const historyScore = goalHit ? 15 : 0;

  return sectorScore + stageScore + needScore + historyScore;
}

function routeAuthResponse(
  prompt: string,
  context: UserRecommendationContext
): { content: string; retrievedCount: number } {
  const q = normalize(prompt);

  // FAQ / general knowledge — highest priority
  const knowledge = retrieveGeneralKnowledge(prompt);
  if (knowledge.source === "faq" && knowledge.confidence !== "low") {
    const related = knowledge.relatedFaqs.length
      ? `\n\nRelated: ${knowledge.relatedFaqs.map((f) => `• ${f.question}`).join("\n")}`
      : "";
    return { content: `${knowledge.answer}${related}`, retrievedCount: 1 };
  }

  // Personalized recommendations
  if (q.includes("recommend") || q.includes("suggest") || q.includes("what should")) {
    const retrieved = retrieveForUser(context, 3);
    const scored = [
      ...retrieved.services.map((s) => ({
        label: `Service: **${s.service_name}**`,
        fit: scoreAuthFit(context, s.tags ?? [], s.target_business_stage ?? []),
      })),
      ...retrieved.courses.map((c) => ({
        label: `Course: **${c.course_title}**`,
        fit: scoreAuthFit(context, c.tags ?? [], c.business_stage ?? []),
      })),
      ...retrieved.events.map((e) => ({
        label: `Event: **${e.event_title}**`,
        fit: scoreAuthFit(context, e.tags ?? [], e.business_stage ?? []),
      })),
    ]
      .sort((a, b) => b.fit - a.fit)
      .slice(0, 4);

    const list = scored.map((r) => `• ${r.label} _(fit: ${r.fit}%)_`).join("\n");
    const total = retrieved.services.length + retrieved.courses.length + retrieved.events.length;

    return {
      content:
        `Based on your **${context.businessStage}** stage in **${context.industry}**:\n\n${list}\n\n` +
        `Open **Recommendations** for your full personalized feed.`,
      retrievedCount: total,
    };
  }

  if (q.includes("service") || q.includes("support") || q.includes("program") || q.includes("fund")) {
    const content = buildServiceList(context);
    return { content, retrievedCount: 3 };
  }

  if (q.includes("course") || q.includes("event") || q.includes("learn") || q.includes("train") || q.includes("workshop")) {
    const content = buildLearningList(context);
    return { content, retrievedCount: 4 };
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("help")) {
    return { content: buildAuthWelcome(context), retrievedCount: 0 };
  }

  // Low-confidence FAQ fallback
  if (knowledge.source !== "fallback") {
    return { content: knowledge.answer, retrievedCount: 1 };
  }

  return {
    content:
      `I can help with services, funding, training, or platform guidance. ` +
      `Try: "What funding programs suit my stage?" or "Show me relevant courses."`,
    retrievedCount: 0,
  };
}

// ─── PATH 02 — ANONYMOUS ─────────────────────────────────────────────────────

const ANON_QUESTIONS: Record<string, string> = {
  user_type:
    "To help you better — are you a **startup founder**, an **SME owner**, a **student entrepreneur**, or exploring as an individual?",
  sector:
    "What **sector or business area** are you in? (e.g. Technology, Agriculture, Retail, Healthcare…)",
  stage:
    "What **stage** is your business at? (Idea, Launch, Growth, Expansion, or Optimization)",
  need:
    "What are you primarily looking for? (e.g. **funding**, **training**, **mentorship**, **market access**, or **compliance support**)",
};

function buildAnonContext(ctx: AnonCollectedContext): UserRecommendationContext {
  return {
    profileId: "guest",
    isAuthenticated: false,
    businessStage: (ctx.stage as BusinessStage) ?? "Exploration",
    industry: ctx.sector ?? "General",
    interests: ctx.need ? [ctx.need] : [],
    goals: [],
    preferredCapabilities: [],
    recommendedTags: [
      ctx.userType,
      ctx.sector?.toLowerCase(),
      ctx.stage?.toLowerCase(),
      ctx.need,
    ].filter(Boolean) as string[],
  };
}

const LOGIN_PROMPT =
  "\n\n---\n💡 **Log in with your KF account** for personalized recommendations based on your full profile.";

function routeAnonResponse(
  prompt: string,
  session: ConversationSession
): { content: string; retrievedCount: number; updatedSession: ConversationSession } {
  const updated = { ...session, turnCount: session.turnCount + 1 };

  // Extract signals from the message first
  const signals = extractAnonSignals(prompt, updated.anonContext);
  updated.anonContext = signals;

  // FAQ / general knowledge — always runs first regardless of collection state
  const knowledge = retrieveGeneralKnowledge(prompt);
  if (knowledge.source === "faq" && knowledge.confidence === "high") {
    const related = knowledge.relatedFaqs.length
      ? `\n\nRelated: ${knowledge.relatedFaqs.map((f) => `• ${f.question}`).join("\n")}`
      : "";
    return {
      content: `${knowledge.answer}${related}`,
      retrievedCount: 1,
      updatedSession: updated,
    };
  }

  const completeness = anonContextCompleteness(updated.anonContext);

  // Enough context — run retrieval
  if (completeness >= 2 || updated.anonStep === "ready") {
    updated.anonStep = "ready";
    const ctx = buildAnonContext(updated.anonContext);
    const retrieved = retrieveForUser(ctx, 3);
    const total =
      retrieved.services.length + retrieved.courses.length + retrieved.events.length;

    const serviceList = retrieved.services
      .slice(0, 2)
      .map((s) => `• **${s.service_name}** — ${s.service_description.slice(0, 100)}…`)
      .join("\n");

    const courseList = retrieved.courses
      .slice(0, 1)
      .map((c) => `• ${c.course_title} (${c.duration})`)
      .join("\n");

    const parts: string[] = [];
    if (serviceList) parts.push(`**Services:**\n${serviceList}`);
    if (courseList) parts.push(`**Courses:**\n${courseList}`);

    const loginSuffix =
      updated.loginPromptShown === 0 ? LOGIN_PROMPT : "";
    if (loginSuffix) updated.loginPromptShown += 1;

    const content =
      parts.length
        ? `Based on what you've shared, here's what I found:\n\n${parts.join("\n\n")}${loginSuffix}`
        : `I couldn't find exact matches, but browse **Discover** for the full catalog.${loginSuffix}`;

    return { content, retrievedCount: total, updatedSession: updated };
  }

  // Still collecting — ask next question
  const nextStep = advanceAnonStep(updated.anonStep, updated.anonContext);
  updated.anonStep = nextStep;

  if (nextStep === "ready") {
    // Recurse once with updated session to trigger retrieval
    return routeAnonResponse("", updated);
  }

  const question = ANON_QUESTIONS[nextStep] ?? ANON_QUESTIONS.need;

  // Surface low-confidence FAQ alongside the question if relevant
  const faqSuffix =
    knowledge.source !== "fallback"
      ? `\n\n_Quick answer: ${knowledge.answer.slice(0, 160)}…_`
      : "";

  return {
    content: `${question}${faqSuffix}`,
    retrievedCount: 0,
    updatedSession: updated,
  };
}

// ─── Welcome messages ─────────────────────────────────────────────────────────

export function getConciergeWelcome(context: UserRecommendationContext): ConciergeMessage {
  initConciergeSession(context.isAuthenticated);

  const content = context.isAuthenticated
    ? buildAuthWelcome(context)
    : `Hello! I'm your DBP Concierge. I'll help you find the right services, funding, and learning opportunities in the UAE ecosystem.\n\n${ANON_QUESTIONS.user_type}`;

  return { id: "welcome", role: "assistant", content, timestamp: Date.now() };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function sendConciergeMessage(
  prompt: string,
  context: UserRecommendationContext
): Promise<ConciergeResponse> {
  await delay(500 + Math.random() * 400);

  const session = getSession(context.isAuthenticated);

  if (context.isAuthenticated) {
    const { content, retrievedCount } = routeAuthResponse(prompt, context);
    session.turnCount += 1;
    return { message: makeMessage(content), retrievedCount };
  }

  const { content, retrievedCount, updatedSession } = routeAnonResponse(prompt, session);
  _session = updatedSession;

  return { message: makeMessage(content), retrievedCount };
}
