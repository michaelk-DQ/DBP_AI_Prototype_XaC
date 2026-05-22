import { useMemo } from "react";
import { getRecommendations } from "../services/ai/recommendationEngine";
import type { RecommendationBundle } from "../types/knowledge";
import { getAuthRecommendationContext, useProfileId } from "../store/authStore";

const EMPTY_BUNDLE: RecommendationBundle = {
  services: [],
  courses: [],
  events: [],
};

export function useRecommendations(limitPerDomain = 6): RecommendationBundle {
  const profileId = useProfileId();

  return useMemo(() => {
    try {
      return getRecommendations(getAuthRecommendationContext(), limitPerDomain);
    } catch (error) {
      console.error("[useRecommendations] Failed to compute recommendations", error);
      return EMPTY_BUNDLE;
    }
  }, [profileId, limitPerDomain]);
}
