'use client';

import React from 'react';

/**
 * Feature Flags System for Predictsports
 * Controls feature availability and A/B testing
 */

export const FEATURE_FLAGS = {
  // Core Features
  PREDICTIONS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_PREDICTIONS === 'true',
  LIVE_UPDATES_ENABLED: process.env.NEXT_PUBLIC_ENABLE_LIVE_UPDATES !== 'false',
  GAMEWEEK_VIEW_ENABLED: process.env.NEXT_PUBLIC_ENABLE_GAMEWEEK === 'true',
  
  // AI Features
  CHAT_ENABLED: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
  SCENARIO_SIMULATOR_ENABLED: process.env.NEXT_PUBLIC_ENABLE_SCENARIOS === 'true',
  ADVANCED_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS === 'true',
  
  // Gamification
  GAMIFICATION_ENABLED: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === 'true',
  LEADERBOARD_ENABLED: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === 'true',
  BADGES_ENABLED: process.env.NEXT_PUBLIC_ENABLE_BADGES === 'true',
  
  // Social
  SHARING_ENABLED: process.env.NEXT_PUBLIC_ENABLE_SHARING === 'true',
  SOCIAL_STATS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_STATS === 'true',
  
  // Premium
  PREMIUM_FEATURES_ENABLED: process.env.NEXT_PUBLIC_ENABLE_PREMIUM === 'false',
  API_ACCESS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_API_ACCESS === 'false',
  
  // Experimental
  NEW_UI_ENABLED: process.env.NEXT_PUBLIC_NEW_UI === 'false',
  DARK_MODE_ONLY: process.env.NEXT_PUBLIC_DARK_MODE_ONLY === 'true',
} as const;

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);
}

/**
 * Hook to check feature in components
 */
export function useFeature(feature: keyof typeof FEATURE_FLAGS): boolean {
  return isFeatureEnabled(feature);
}

/**
 * Component wrapper for feature flags
 */
export function FeatureWrapper({
  feature,
  children,
  fallback: _fallback,
}: {
  feature: keyof typeof FEATURE_FLAGS;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return isFeatureEnabled(feature) ? <>{children}</> : <>{_fallback ?? null}</>;
}
