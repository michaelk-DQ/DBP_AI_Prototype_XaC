/**
 * Conversation state types for the two-path Concierge AI.
 * Authenticated path: profile-hydrated, minimal questioning.
 * Anonymous path: progressive context collection, max 3 questions before retrieval.
 */

export type ConversationPath = "authenticated" | "anonymous";

export type AnonCollectionStep =
  | "user_type"     // What kind of user are you?
  | "sector"        // What sector / business area?
  | "stage"         // What business stage?
  | "need"          // What specific need?
  | "ready";        // Enough context — run retrieval

export interface AnonCollectedContext {
  userType?: string;
  sector?: string;
  stage?: string;
  need?: string;
}

export interface ConversationSession {
  path: ConversationPath;
  /** How many times the login prompt has been shown (anonymous only). */
  loginPromptShown: number;
  /** Anonymous progressive context. */
  anonContext: AnonCollectedContext;
  /** Next question step for anonymous flow. */
  anonStep: AnonCollectionStep;
  /** Total turns in this session. */
  turnCount: number;
}

export function createSession(isAuthenticated: boolean): ConversationSession {
  return {
    path: isAuthenticated ? "authenticated" : "anonymous",
    loginPromptShown: 0,
    anonContext: {},
    anonStep: "user_type",
    turnCount: 0,
  };
}

/** Extract context signals from a free-text message to skip unnecessary questions. */
export function extractAnonSignals(
  message: string,
  current: AnonCollectedContext
): AnonCollectedContext {
  const m = message.toLowerCase();
  const updated = { ...current };

  // Stage signals
  if (!updated.stage) {
    if (m.includes("idea") || m.includes("ideation")) updated.stage = "Idea";
    else if (m.includes("launch") || m.includes("starting")) updated.stage = "Launch";
    else if (m.includes("growth") || m.includes("growing") || m.includes("scaling")) updated.stage = "Growth";
    else if (m.includes("expansion") || m.includes("expand") || m.includes("export")) updated.stage = "Expansion";
    else if (m.includes("optimis") || m.includes("optimiz")) updated.stage = "Optimization";
  }

  // Sector signals
  if (!updated.sector) {
    const sectorMap: Record<string, string> = {
      tech: "Technology",
      software: "Technology",
      fintech: "Technology",
      agri: "Agriculture",
      farm: "Agriculture",
      food: "Food & Agriculture",
      retail: "Retail & E-commerce",
      ecommerce: "Retail & E-commerce",
      "e-commerce": "Retail & E-commerce",
      health: "Healthcare",
      education: "Education",
      manufacturing: "Manufacturing",
      logistics: "Logistics",
      tourism: "Tourism & Hospitality",
      construction: "Construction",
      energy: "Energy",
    };
    for (const [keyword, sector] of Object.entries(sectorMap)) {
      if (m.includes(keyword)) {
        updated.sector = sector;
        break;
      }
    }
  }

  // Need signals
  if (!updated.need) {
    if (m.includes("fund") || m.includes("invest") || m.includes("capital") || m.includes("loan")) {
      updated.need = "funding";
    } else if (m.includes("train") || m.includes("course") || m.includes("learn") || m.includes("workshop")) {
      updated.need = "training";
    } else if (m.includes("mentor") || m.includes("coach") || m.includes("advice")) {
      updated.need = "mentorship";
    } else if (m.includes("market") || m.includes("customer") || m.includes("sales")) {
      updated.need = "market_access";
    } else if (m.includes("compli") || m.includes("legal") || m.includes("licens")) {
      updated.need = "compliance";
    } else if (m.includes("digital") || m.includes("tech") || m.includes("software")) {
      updated.need = "digital_transformation";
    }
  }

  // User type signals
  if (!updated.userType) {
    if (m.includes("startup") || m.includes("founder")) updated.userType = "startup";
    else if (m.includes("sme") || m.includes("small business") || m.includes("company")) updated.userType = "sme";
    else if (m.includes("student") || m.includes("university") || m.includes("graduate")) updated.userType = "student";
    else if (m.includes("freelance") || m.includes("solo") || m.includes("individual")) updated.userType = "freelancer";
  }

  return updated;
}

/** Determine how complete the anonymous context is. */
export function anonContextCompleteness(ctx: AnonCollectedContext): number {
  let score = 0;
  if (ctx.userType) score++;
  if (ctx.sector) score++;
  if (ctx.stage) score++;
  if (ctx.need) score++;
  return score; // 0–4
}

/** Advance the anonymous collection step based on what's been collected. */
export function advanceAnonStep(
  current: AnonCollectionStep,
  ctx: AnonCollectedContext
): AnonCollectionStep {
  const completeness = anonContextCompleteness(ctx);

  // If we have 2+ signals, skip to ready
  if (completeness >= 2) return "ready";

  const order: AnonCollectionStep[] = ["user_type", "sector", "stage", "need", "ready"];
  const idx = order.indexOf(current);

  // Skip steps already answered
  const next = order.slice(idx + 1).find((step) => {
    if (step === "ready") return true;
    if (step === "user_type" && !ctx.userType) return true;
    if (step === "sector" && !ctx.sector) return true;
    if (step === "stage" && !ctx.stage) return true;
    if (step === "need" && !ctx.need) return true;
    return false;
  });

  return next ?? "ready";
}
