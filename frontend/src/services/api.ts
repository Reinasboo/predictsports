'use client';

import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: process.env.NEXT_PUBLIC_API_TIMEOUT ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) : 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Fixtures Service
 */
export const fixtureService = {
  getAll: (params?: { league?: string; season?: number; status?: string; limit?: number; offset?: number }) =>
    api.get('/fixtures', { params }),
  getByDate: (date: string) => api.get(`/fixtures/date/${date}`),
  getLive: () => api.get('/fixtures/live'),
  getGameweek: (leagueId: string, week: number) => api.get(`/gameweek/${leagueId}?week=${week}`),
  getUpcoming: (days?: number) => api.get('/fixtures/upcoming', { params: { days } }),
};

/**
 * Predictions Service
 */
export const predictionService = {
  getForMatch: (matchId: string) => api.get(`/predictions/${matchId}`),
  batch: (matchIds: string[]) => api.post('/predictions/batch', { matchIds }),
  generate: (matchIds: string[]) => api.post('/predictions/generate', { matchIds }),
  getConfidence: (matchId: string) => api.get(`/confidence/${matchId}`),
  getAdvanced: (matchId: string) => api.get(`/predictions/advanced/${matchId}`),
};

/**
 * Match Service
 */
export const matchService = {
  getById: (id: string) => api.get(`/matches/${id}`),
  getH2H: (homeId: string, awayId: string) => api.get(`/matches/h2h/${homeId}/${awayId}`),
  getTeamMatches: (teamId: string, limit?: number) => api.get(`/team/${teamId}/matches`, { params: { limit } }),
  getTeamStats: (teamId: string) => api.get(`/team/${teamId}/stats`),
};

/**
 * Live Feed Service
 */
export const liveService = {
  getLiveMatches: () => api.get('/live-feed'),
  getMatchUpdates: (matchId: string) => api.get(`/live-feed/${matchId}`),
};

/**
 * Health & Status Service
 */
export const healthService = {
  check: () => api.get('/health'),
  getStatus: () => api.get('/status'),
};

/**
 * User Service
 */
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.patch('/user/profile', data),
  getPredictionHistory: () => api.get('/user/predictions/history'),
  getAccuracy: () => api.get('/user/predictions/accuracy'),
  getBadges: () => api.get('/user/badges'),
  getLeaderboard: (limit?: number) => api.get('/user/leaderboard', { params: { limit } }),
};

/**
 * Authentication Service
 */
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (email: string, password: string, username: string) =>
    api.post('/auth/register', { email, password, username }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
};

export default api;
