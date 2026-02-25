export interface Match {
  id: string;
  internal_match_id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_name: string;
  away_team_name: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  kickoff: Date;
  home_goals: number | null;
  away_goals: number | null;
  competition_id: string;
  referee_id: string | null;
  venue: string;
  created_at: Date;
  updated_at: Date;
}

export interface Prediction {
  id: string;
  match_id: string;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  over_2_5_probability: number;
  both_teams_score_probability: number;
  confidence: 'very_high' | 'high' | 'medium' | 'low';
  model_agreement: number;
  data_completeness: number;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  internal_team_id: string;
  name: string;
  country: string;
  founded: number | null;
  logo: string;
  api_football_id: number | null;
  football_data_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Competition {
  id: string;
  name: string;
  country: string;
  season: number;
  current_matchday: number;
  total_matchdays: number;
  created_at: Date;
  updated_at: Date;
}

export interface Odds {
  id: string;
  match_id: string;
  bookmaker: string;
  home_win: number;
  draw: number;
  away_win: number;
  timestamp: Date;
}

export interface Fixture {
  id: string;
  match_id: string;
  competition_id: string;
  matchday: number;
  date: Date;
  status: string;
}
