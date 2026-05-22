import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  AUTHENTICATED_PROFILE_IDS,
  DEFAULT_PROFILE_ID,
  getMockProfile,
  isValidProfileId,
} from "../mocks/users/mockProfiles";
import type {
  BusinessStage,
  ProfileId,
  UserGoals,
  UserProfile,
  UserRecommendationContext,
} from "../types/user";
import { toRecommendationContext } from "../types/user";

export interface AuthState {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  loginAs: (profileId: ProfileId) => void;
  logout: () => void;
  switchProfile: (profileId: ProfileId) => void;
}

function resolveProfile(profileId: ProfileId): UserProfile {
  if (!isValidProfileId(profileId)) {
    console.warn(
      `[authStore] Unknown profile "${profileId}" — falling back to guest.`
    );
    return getMockProfile(DEFAULT_PROFILE_ID);
  }

  return getMockProfile(profileId);
}

function applyProfile(profile: UserProfile): Pick<AuthState, "currentUser" | "isAuthenticated"> {
  return {
    currentUser: profile,
    isAuthenticated: profile.isAuthenticated,
  };
}

const guestProfile = getMockProfile(DEFAULT_PROFILE_ID);

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: guestProfile,
  isAuthenticated: false,

  loginAs: (profileId) => {
    const profile = resolveProfile(profileId);

    if (profile.id === DEFAULT_PROFILE_ID) {
      console.warn(
        "[authStore] loginAs called with guest — use logout() for guest mode."
      );
    }

    set(applyProfile(profile));
  },

  logout: () => {
    set(applyProfile(getMockProfile(DEFAULT_PROFILE_ID)));
  },

  switchProfile: (profileId) => {
    set(applyProfile(resolveProfile(profileId)));
  },
}));

export const selectCurrentUser = (state: AuthState): UserProfile =>
  state.currentUser;

export const selectProfileId = (state: AuthState): ProfileId =>
  state.currentUser.id;

export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.isAuthenticated;

export const selectBusinessStage = (state: AuthState): BusinessStage =>
  state.currentUser.businessStage;

export const selectInterests = (state: AuthState): string[] =>
  state.currentUser.interests ?? [];

export const selectIndustry = (state: AuthState): string =>
  state.currentUser.industry ?? "";

export const selectRecommendationTags = (state: AuthState): string[] =>
  state.currentUser.recommendedTags ?? [];

export const selectGoals = (state: AuthState): UserGoals =>
  state.currentUser.goals ?? [];

export const selectPreferredCapabilities = (state: AuthState): string[] =>
  state.currentUser.preferredCapabilities ?? [];

export const selectRecommendationContext = (
  state: AuthState
): UserRecommendationContext => toRecommendationContext(state.currentUser);

export function useCurrentUser(): UserProfile {
  return useAuthStore(selectCurrentUser);
}

export function useProfileId(): ProfileId {
  return useAuthStore(selectProfileId);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore(selectIsAuthenticated);
}

/** Stable shallow selector — prevents infinite re-render from new object references. */
export function useUserRecommendationContext(): UserRecommendationContext {
  return useAuthStore(
    useShallow((state) => toRecommendationContext(state.currentUser))
  );
}

export function useUserPersonalization() {
  return useAuthStore(
    useShallow((state) => ({
      businessStage: state.currentUser.businessStage,
      interests: state.currentUser.interests ?? [],
      industry: state.currentUser.industry ?? "",
      recommendedTags: state.currentUser.recommendedTags ?? [],
      goals: state.currentUser.goals ?? [],
      preferredCapabilities: state.currentUser.preferredCapabilities ?? [],
    }))
  );
}

export function getAuthRecommendationContext(): UserRecommendationContext {
  return selectRecommendationContext(useAuthStore.getState());
}

export function getCurrentUser(): UserProfile {
  return selectCurrentUser(useAuthStore.getState());
}

export { AUTHENTICATED_PROFILE_IDS, DEFAULT_PROFILE_ID };
