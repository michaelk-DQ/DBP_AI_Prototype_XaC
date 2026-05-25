import type { ProfileId, UserProfile } from "../../types/user";

/**
 * Canonical mock user profiles for prototype demos and AI personalization.
 * Tags and capabilities align with kb_services / kb_courses / kb_events vocabulary.
 */
export const MOCK_USER_PROFILES: Record<ProfileId, UserProfile> = {
  guest: {
    id: "guest",
    profileType: "guest",
    displayName: "Guest Explorer",
    isAuthenticated: false,
    businessStage: null,
    industry: null,
    interests: [],
    goals: [],
    preferredCapabilities: [],
    recommendedTags: [],
    supabaseUserId: null,
  },

  startup_founder: {
    id: "startup_founder",
    profileType: "startup_founder",
    displayName: "Layla Al Mansoori",
    isAuthenticated: true,
    businessStage: "Launch",
    industry: "Technology",
    interests: [
      "product-market fit",
      "venture capital",
      "fintech",
      "networking",
      "digital integration",
    ],
    goals: [
      "validate_business_idea",
      "build_mvp",
      "raise_funding",
      "acquire_customers",
      "network_with_peers",
    ],
    preferredCapabilities: [
      "Finance & Investment",
      "Business Strategy & Innovation",
      "Technology & Digital Systems",
    ],
    recommendedTags: [
      "startup",
      "launch",
      "fintech",
      "innovation",
      "venture capital",
      "networking",
      "digital integration",
      "fundraising",
    ],
    supabaseUserId: null,
  },

  growth_sme: {
    id: "growth_sme",
    profileType: "growth_sme",
    displayName: "Omar Hassan Trading LLC",
    isAuthenticated: true,
    businessStage: "Growth",
    industry: "Retail & E-commerce",
    interests: [
      "export markets",
      "e-commerce",
      "operational scaling",
      "stakeholder engagement",
      "trade shows",
    ],
    goals: [
      "scale_operations",
      "expand_export_markets",
      "improve_digital_capabilities",
      "access_government_programs",
    ],
    preferredCapabilities: [
      "Business Development, Incentives & Incubation",
      "Support Services",
      "Technology & Digital Systems",
    ],
    recommendedTags: [
      "growth",
      "expansion",
      "e-commerce",
      "export",
      "sme",
      "networking",
      "stakeholder engagement",
      "trade shows",
      "cross-border scaling",
    ],
    supabaseUserId: null,
  },

  agritech_founder: {
    id: "agritech_founder",
    profileType: "agritech_founder",
    displayName: "GreenHarvest AgTech",
    isAuthenticated: true,
    businessStage: "Growth",
    industry: "Agriculture & Sustainability",
    interests: [
      "sustainable agriculture",
      "supply chain innovation",
      "climate-smart farming",
      "food security",
      "smart irrigation",
    ],
    goals: [
      "develop_agritech_solution",
      "adopt_sustainable_practices",
      "raise_funding",
      "scale_operations",
      "access_government_programs",
    ],
    preferredCapabilities: [
      "Business Strategy & Innovation",
      "Technology & Digital Systems",
      "Support Services",
    ],
    recommendedTags: [
      "agritech",
      "sustainability",
      "growth",
      "innovation",
      "supply chain",
      "climate",
      "food security",
      "smart farming",
      "uae ecosystem",
    ],
    supabaseUserId: null,
  },

  student_entrepreneur: {
    id: "student_entrepreneur",
    profileType: "student_entrepreneur",
    displayName: "Fatima Al Ketbi",
    isAuthenticated: true,
    businessStage: "Idea",
    industry: "Education & Youth Entrepreneurship",
    interests: [
      "entrepreneurship basics",
      "mentorship",
      "hackathons",
      "side projects",
      "campus innovation",
    ],
    goals: [
      "learn_entrepreneurship",
      "find_mentorship",
      "validate_business_idea",
      "network_with_peers",
    ],
    preferredCapabilities: [
      "Business Development, Incentives & Incubation",
      "Technology & Digital Systems",
    ],
    recommendedTags: [
      "idea",
      "launch",
      "startup",
      "mentorship",
      "learning",
      "innovation",
      "networking",
      "youth entrepreneurship",
      "workshop",
    ],
    supabaseUserId: null,
  },
};

export const DEFAULT_PROFILE_ID: ProfileId = "guest";

export const AUTHENTICATED_PROFILE_IDS: ProfileId[] = (
  Object.keys(MOCK_USER_PROFILES) as ProfileId[]
).filter((id) => id !== DEFAULT_PROFILE_ID);

/** Resolves a mock profile by id; falls back to guest when unknown. */
export function getMockProfile(profileId: ProfileId): UserProfile {
  return MOCK_USER_PROFILES[profileId] ?? MOCK_USER_PROFILES[DEFAULT_PROFILE_ID];
}

export function isValidProfileId(value: string): value is ProfileId {
  return value in MOCK_USER_PROFILES;
}

export function listMockProfiles(): UserProfile[] {
  return Object.values(MOCK_USER_PROFILES);
}

export function listSwitchableProfiles(): UserProfile[] {
  return listMockProfiles();
}
