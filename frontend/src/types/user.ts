/**
 * Core user domain types for mock auth and future Supabase Auth integration.
 * Maps cleanly to recommendation, retrieval, and concierge personalization context.
 */

/** Lifecycle stage aligned with knowledge-base target_business_stage values. */
export type BusinessStage =
  | "Idea"
  | "Launch"
  | "Growth"
  | "Expansion"
  | "Optimization"
  | "Exploration";

/** Prototype persona identifiers — extend when adding new mock or real users. */
export type ProfileType =
  | "guest"
  | "startup_founder"
  | "growth_sme"
  | "agritech_founder"
  | "student_entrepreneur";

export type ProfileId = ProfileType;

/** Semantic goals consumed by recommendation and concierge engines. */
export type UserGoal =
  | "explore_ecosystem"
  | "validate_business_idea"
  | "build_mvp"
  | "raise_funding"
  | "acquire_customers"
  | "scale_operations"
  | "expand_export_markets"
  | "improve_digital_capabilities"
  | "strengthen_cybersecurity"
  | "adopt_sustainable_practices"
  | "develop_agritech_solution"
  | "learn_entrepreneurship"
  | "find_mentorship"
  | "network_with_peers"
  | "access_government_programs";

export type UserGoals = UserGoal[];

/**
 * Full user profile used across auth state, AI personalization, and UI.
 * `supabaseUserId` is reserved for future Supabase Auth session binding.
 */
export interface UserProfile {
  id: ProfileId;
  profileType: ProfileType;
  displayName: string;
  isAuthenticated: boolean;
  businessStage: BusinessStage;
  industry: string;
  interests: string[];
  goals: UserGoals;
  preferredCapabilities: string[];
  recommendedTags: string[];
  /** Optional link to Supabase Auth user — populated after real auth integration. */
  supabaseUserId?: string | null;
}

/** Slice of profile data passed into AI recommendation and retrieval pipelines. */
export interface UserRecommendationContext {
  profileId: ProfileId;
  isAuthenticated: boolean;
  businessStage: BusinessStage;
  industry: string;
  interests: string[];
  goals: UserGoals;
  preferredCapabilities: string[];
  recommendedTags: string[];
}

/** Maps a profile to the recommendation context shape used by AI services. */
export function toRecommendationContext(
  profile: UserProfile
): UserRecommendationContext {
  return {
    profileId: profile.id,
    isAuthenticated: profile.isAuthenticated,
    businessStage: profile.businessStage,
    industry: profile.industry ?? "General",
    interests: profile.interests ?? [],
    goals: profile.goals ?? [],
    preferredCapabilities: profile.preferredCapabilities ?? [],
    recommendedTags: profile.recommendedTags ?? [],
  };
}
