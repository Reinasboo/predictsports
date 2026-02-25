/**
 * Predictsports Type Definitions
 * Complete TypeScript types for the platform
 */

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================
// Team & League
// ============================================

export interface Team {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: number;
  stadium?: string;
}

export interface League {
  id: string;
  name: string;
  code: string;
  country: string;
  season: number;
  totalMatchdays: number;
}

export interface Competition {
  id: string;
  name: string;
  country: string;
  season: number;
  currentMatchday: number;
  totalMatchdays: number;
}

// ============================================
// Match Data
// ============================================

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  competition: string;
  kickoff: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  venue: string;
  referee?: string;
  attendance?: number;
  formation?: {
    home: string;
    away: string;
  };
  weather: Weather;
  lineups?: {
    home: Player[];
    away: Player[];
  };
  score?: {
    home: number;
    away: number;
    homeHT?: number;
    awayHT?: number;
  };
  stats?: MatchStats;
}

export interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  image?: string;
  status?: 'STARTING' | 'BENCH' | 'OUT';
  rating?: number;
}

export interface MatchStats {
  home: TeamStats;
  away: TeamStats;
}

export interface TeamStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  tackles: number;
  fouls: number;
  corners: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  xG: number;
  xGA: number;
}

// ============================================
// Predictions
// ============================================

export interface Prediction {
  matchId: string;
  generatedAt: string;
  confidence: ConfidenceLevel;
  models: {
    poisson: PredictionOutcome;
    logistic: PredictionOutcome;
    form: PredictionOutcome;
    tactical: PredictionOutcome;
  };
  ensemble: PredictionOutcome;
  markets: Markets;
  scenarios: Scenarios;
  topScorelines: Scoreline[];
}

export interface PredictionOutcome {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface Markets {
  result: PredictionOutcome;
  goals: {
    over05: number;
    over15: number;
    over25: number;
    over35: number;
    under05: number;
    under15: number;
    under25: number;
    under35: number;
  };
  btts: number;
  teamScores: {
    homeFirstGoal: number;
    cleanSheetHome: number;
    home2Plus: number;
    awayFirstGoal: number;
    cleanSheetAway: number;
    away2Plus: number;
  };
}

export interface Scenarios {
  favoritesDominance: {
    description: string;
    probability: number;
    expectedGoals: { home: number; away: number };
  };
  balancedTactical: {
    description: string;
    probability: number;
    expectedGoals: { home: number; away: number };
  };
  upset: {
    description: string;
    probability: number;
    expectedGoals: { home: number; away: number };
  };
}

export interface Scoreline {
  scoreline: string;
  probability: number;
}

export interface Confidence {
  matchId: string;
  overallConfidence: ConfidenceLevel;
  scores: {
    modelAgreement: number;
    dataCompleteness: number;
    matchVolatility: number;
    historicalAccuracy: number;
  };
  factors: {
    positive: string[];
    negative: string[];
  };
}

export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';

// ============================================
// User & Gamification
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  favoriteTeams: string[];
  joinedAt: string;
  lastLogin: string;
}

export interface UserProfile extends User {
  xp: number;
  level: number;
  accuracy: number;
  predictions: number;
  correctPredictions: number;
  streak: number;
  badges: Badge[];
  stats: UserStats;
}

export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  winStreak: number;
  loseStreak: number;
  totalXP: number;
  currentLevel: number;
  nextLevelXP: number;
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export type BadgeType =
  | 'PERFECT_PREDICTION'
  | 'STREAK_5'
  | 'STREAK_10'
  | 'EARLY_BIRD'
  | 'POPULAR_PREDICTOR'
  | 'ACCURACY_MASTER'
  | 'MASTER_ANALYST'
  | 'FIRST_LOGIN'
  | 'LEVEL_10'
  | 'LEVEL_50';

// ============================================
// Live Updates
// ============================================

export interface LiveUpdate {
  matchId: string;
  type: LiveEventType;
  timestamp: string;
  data: any;
}

export type LiveEventType =
  | 'GOAL'
  | 'CARD'
  | 'SUBSTITUTION'
  | 'ODDS_UPDATE'
  | 'PREDICTION_UPDATE'
  | 'LINEUP_UPDATE'
  | 'STAT_UPDATE'
  | 'END_MATCH';

export interface GoalEvent {
  type: 'GOAL';
  team: 'home' | 'away';
  player: Player;
  minute: number;
  secondaryPlayer?: Player;
  isOwnGoal: boolean;
  isPenalty: boolean;
}

export interface CardEvent {
  type: 'CARD';
  team: 'home' | 'away';
  player: Player;
  minute: number;
  cardType: 'yellow' | 'red';
}

// ============================================
// Leaderboard
// ============================================

export interface LeaderboardEntry {
  rank: number;
  user: User;
  accuracy: number;
  predictions: number;
  streak: number;
  xp: number;
  level: number;
}

// ============================================
// API Keys & Auth
// ============================================

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

// ============================================
// Settings & Preferences
// ============================================

export interface UserPreferences {
  theme: 'dark' | 'light';
  confidenceFilter: 'all' | 'high' | 'medium' | 'low';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  liveMatchAlerts: boolean;
  predictionReminders: boolean;
  weeklyDigest: boolean;
}

export interface PrivacySettings {
  profilePublic: boolean;
  statsPublic: boolean;
  predictionsPublic: boolean;
  leaderboardOptIn: boolean;
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
}

export class PredictSportsError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
  }
}
