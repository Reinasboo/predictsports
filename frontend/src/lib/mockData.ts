/**
 * Predictsports Mock Data & Seeding
 * Comprehensive dummy data for development and testing
 */

export const mockTeams = [
  {
    id: 'team_1',
    name: 'Manchester United',
    logo: 'https://images.unsplash.com/photo-1552488544-72cde299d0eb?w=200',
    country: 'England',
    founded: 1878,
    stadium: 'Old Trafford',
    league_position: 3,
    points: 52,
    wins: 15,
    draws: 7,
    losses: 6,
    goals_for: 48,
    goals_against: 28,
    home_win_pct: 0.58,
    away_win_pct: 0.35,
    avg_xg_for: 1.6,
    avg_xg_against: 1.1,
  },
  {
    id: 'team_2',
    name: 'Liverpool',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200',
    country: 'England',
    founded: 1892,
    stadium: 'Anfield',
    league_position: 2,
    points: 55,
    wins: 16,
    draws: 7,
    losses: 5,
    goals_for: 52,
    goals_against: 25,
    home_win_pct: 0.62,
    away_win_pct: 0.38,
    avg_xg_for: 1.8,
    avg_xg_against: 1.0,
  },
  {
    id: 'team_3',
    name: 'Manchester City',
    logo: 'https://images.unsplash.com/photo-1589425844669-fdf9c903b73b?w=200',
    country: 'England',
    founded: 1880,
    stadium: 'Etihad Stadium',
    league_position: 1,
    points: 62,
    wins: 18,
    draws: 8,
    losses: 2,
    goals_for: 58,
    goals_against: 18,
    home_win_pct: 0.71,
    away_win_pct: 0.57,
    avg_xg_for: 2.1,
    avg_xg_against: 0.8,
  },
];

export const mockMatches = [
  {
    id: 'match_1',
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    kickoff: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    competition: 'Premier League',
    status: 'SCHEDULED',
    venue: 'Old Trafford',
    referee: { name: 'Michael Oliver', yellowCards: 35, redCards: 2 },
    formation: { home: '4-3-3', away: '4-2-3-1' },
    weather: {
      temperature: 12,
      humidity: 75,
      windSpeed: 10,
      condition: 'Partly Cloudy',
      precipitation: 0,
    },
  },
  {
    id: 'match_2',
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[0],
    kickoff: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    competition: 'Premier League',
    status: 'SCHEDULED',
    venue: 'Etihad Stadium',
    referee: { name: 'Stuart Attwell', yellowCards: 28, redCards: 1 },
    formation: { home: '3-1-4-2', away: '4-3-3' },
    weather: {
      temperature: 14,
      humidity: 60,
      windSpeed: 8,
      condition: 'Cloudy',
      precipitation: 2,
    },
  },
];

export const mockPredictions = {
  match_1: {
    matchId: 'match_1',
    generatedAt: new Date().toISOString(),
    confidence: 'HIGH',
    models: {
      poisson: {
        homeWin: 0.52,
        draw: 0.25,
        awayWin: 0.23,
      },
      logistic: {
        homeWin: 0.55,
        draw: 0.22,
        awayWin: 0.23,
      },
      form: {
        homeWin: 0.48,
        draw: 0.28,
        awayWin: 0.24,
      },
      tactical: {
        homeWin: 0.54,
        draw: 0.24,
        awayWin: 0.22,
      },
    },
    ensemble: {
      homeWin: 0.5225,
      draw: 0.2475,
      awayWin: 0.23,
    },
    markets: {
      result: {
        homeWin: 0.5225,
        draw: 0.2475,
        awayWin: 0.23,
      },
      goals: {
        over05: 0.78,
        over15: 0.62,
        over25: 0.42,
        over35: 0.18,
      },
      btts: 0.45,
      teamScores: {
        homeFirstGoal: 0.35,
        cleanSheetHome: 0.48,
        home2Plus: 0.38,
      },
    },
    topScorelines: [
      { scoreline: '2-1', probability: 0.08 },
      { scoreline: '1-0', probability: 0.07 },
      { scoreline: '1-1', probability: 0.06 },
      { scoreline: '2-0', probability: 0.05 },
      { scoreline: '0-0', probability: 0.04 },
    ],
    scenarios: {
      favoritesDominance: {
        description: 'Home team dominates throughout',
        probability: 0.35,
        expectedGoals: { home: 2.1, away: 0.6 },
      },
      balancedTactical: {
        description: 'Tactical equilibrium',
        probability: 0.42,
        expectedGoals: { home: 1.5, away: 1.2 },
      },
      upset: {
        description: 'Away team pulls off upset',
        probability: 0.23,
        expectedGoals: { home: 0.8, away: 1.8 },
      },
    },
  },
};

export const mockConfidence = {
  match_1: {
    matchId: 'match_1',
    overallConfidence: 'HIGH',
    scores: {
      modelAgreement: 0.89,
      dataCompleteness: 0.95,
      matchVolatility: 0.42,
      historicalAccuracy: 0.82,
    },
    factors: {
      positive: [
        'High model agreement',
        'Complete team data',
        'Recent head-to-head data',
      ],
      negative: ['Moderate match volatility'],
    },
  },
};

export const mockLiveUpdates = [
  {
    type: 'GOAL',
    minute: 23,
    team: 'Manchester United',
    player: 'Bruno Fernandes',
    timestamp: Date.now(),
  },
  {
    type: 'CARD',
    minute: 45,
    team: 'Liverpool',
    player: 'Virgil van Dijk',
    cardType: 'yellow',
    timestamp: Date.now() + 60000,
  },
];

export const mockLeaderboard = [
  {
    rank: 1,
    username: 'PredictionMaster',
    accuracy: 0.68,
    predictions: 234,
    xp: 15420,
    badges: ['prediction_master', 'accuracy_king', 'hot_streak'],
  },
  {
    rank: 2,
    username: 'FootballOracle',
    accuracy: 0.65,
    predictions: 198,
    xp: 13280,
    badges: ['prediction_master', 'consistency'],
  },
  {
    rank: 3,
    username: 'StatsBoffin',
    accuracy: 0.63,
    predictions: 256,
    xp: 12540,
    badges: ['league_leader', 'early_bird'],
  },
];

export const mockUserProfile = {
  id: 'user_123',
  email: 'user@example.com',
  username: 'PredictionPro',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  xp: 8540,
  level: 8,
  badges: ['prediction_master', 'hot_streak'],
  accuracy: 0.62,
  totalPredictions: 145,
  correctPredictions: 90,
  weeklyLeaderboardRank: 12,
  joinDate: '2024-01-15',
  stats: {
    bestStreak: 8,
    totalXP: 8540,
    favoriteCompetition: 'Premier League',
    favoriteTeam: 'Manchester United',
  },
};

export const mockGameweek = {
  league: 'Premier League',
  season: 2024,
  week: 24,
  matches: mockMatches,
  totalMatches: 10,
  liveMatches: 2,
  finishedMatches: 7,
};

export const mockChartData = [
  { date: 'Jan', accuracy: 0.58, predictions: 12 },
  { date: 'Feb', accuracy: 0.62, predictions: 18 },
  { date: 'Mar', accuracy: 0.59, predictions: 16 },
  { date: 'Apr', accuracy: 0.65, predictions: 20 },
  { date: 'May', accuracy: 0.68, predictions: 24 },
  { date: 'Jun', accuracy: 0.64, predictions: 22 },
];

export const mockHeadToHead = {
  played: 28,
  homeWins: 12,
  draws: 8,
  awayWins: 8,
  homeGoalsFor: 38,
  homeGoalsAgainst: 28,
  lastMatches: [
    { date: '2023-11-15', result: 'D 1-1' },
    { date: '2023-04-10', result: 'W 2-1' },
    { date: '2022-12-26', result: 'L 0-1' },
  ],
};
