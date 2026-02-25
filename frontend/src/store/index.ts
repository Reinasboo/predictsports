'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: string[];
  accuracy: number;
}

interface LiveUpdate {
  matchId: string;
  type: 'GOAL' | 'CARD' | 'SUBSTITUTION' | 'ODDS_UPDATE' | 'PREDICTION_UPDATE';
  data: any;
  timestamp: number;
}

interface PredsportStore {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;

  // Fixtures & Matches
  fixtures: any[];
  selectedMatch: any | null;
  setFixtures: (fixtures: any[]) => void;
  setSelectedMatch: (match: any | null) => void;

  // Predictions
  predictions: Record<string, any>;
  setPredictions: (matchId: string, prediction: any) => void;
  getPredictions: (matchId: string) => any | null;

  // Live Updates
  liveUpdates: LiveUpdate[];
  addLiveUpdate: (update: LiveUpdate) => void;
  clearLiveUpdates: () => void;

  // UI State
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;

  // Preferences
  favoriteTeams: string[];
  addFavoriteTeam: (teamId: string) => void;
  removeFavoriteTeam: (teamId: string) => void;
  confidenceFilter: 'all' | 'high' | 'medium' | 'low';
  setConfidenceFilter: (filter: 'all' | 'high' | 'medium' | 'low') => void;
}

export const useStore = create<PredsportStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Auth
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user: User, token: string) =>
          set({ user, token, isAuthenticated: true }),
        logout: () =>
          set({ user: null, token: null, isAuthenticated: false, predictions: {} }),

        // Fixtures & Matches
        fixtures: [],
        selectedMatch: null,
        setFixtures: (fixtures: any[]) => set({ fixtures }),
        setSelectedMatch: (match: any | null) => set({ selectedMatch: match }),

        // Predictions
        predictions: {},
        setPredictions: (matchId: string, prediction: any) =>
          set((state) => ({
            predictions: {
              ...state.predictions,
              [matchId]: prediction,
            },
          })),
        getPredictions: (matchId: string) => get().predictions[matchId] || null,

        // Live Updates
        liveUpdates: [],
        addLiveUpdate: (update: LiveUpdate) =>
          set((state) => ({
            liveUpdates: [update, ...state.liveUpdates].slice(0, 100), // Keep last 100
          })),
        clearLiveUpdates: () => set({ liveUpdates: [] }),

        // UI State
        theme: 'dark',
        sidebarOpen: true,
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark',
          })),
        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        // Preferences
        favoriteTeams: [],
        addFavoriteTeam: (teamId: string) =>
          set((state) => ({
            favoriteTeams: [...new Set([...state.favoriteTeams, teamId])],
          })),
        removeFavoriteTeam: (teamId: string) =>
          set((state) => ({
            favoriteTeams: state.favoriteTeams.filter((id) => id !== teamId),
          })),
        confidenceFilter: 'all',
        setConfidenceFilter: (filter: 'all' | 'high' | 'medium' | 'low') =>
          set({ confidenceFilter: filter }),
      }),
      {
        name: 'predictsports-store',
      }
    )
  )
);
