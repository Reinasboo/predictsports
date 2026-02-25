-- Predictsports Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  internal_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  league VARCHAR(50),
  api_football_id INTEGER,
  football_data_id INTEGER,
  logo_url VARCHAR(255),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  internal_id VARCHAR(100) UNIQUE NOT NULL,
  home_team_id INTEGER NOT NULL REFERENCES teams(id),
  away_team_id INTEGER NOT NULL REFERENCES teams(id),
  match_date TIMESTAMP NOT NULL,
  league VARCHAR(50),
  season INTEGER,
  status VARCHAR(50),
  home_score INTEGER,
  away_score INTEGER,
  api_football_id INTEGER,
  football_data_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (home_team_id) REFERENCES teams(id),
  FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

-- Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  home_win_prob DECIMAL(5, 4),
  draw_prob DECIMAL(5, 4),
  away_win_prob DECIMAL(5, 4),
  over_0_5_goals DECIMAL(5, 4),
  over_1_5_goals DECIMAL(5, 4),
  over_2_5_goals DECIMAL(5, 4),
  both_teams_score DECIMAL(5, 4),
  confidence_level VARCHAR(50),
  model_agreement DECIMAL(5, 4),
  recommendation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id)
);

-- Scorelines Table
CREATE TABLE IF NOT EXISTS scorelines (
  id SERIAL PRIMARY KEY,
  prediction_id INTEGER NOT NULL REFERENCES predictions(id),
  score VARCHAR(10),
  probability DECIMAL(5, 4),
  position INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);

-- User Predictions Table
CREATE TABLE IF NOT EXISTS user_predictions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  prediction_id INTEGER NOT NULL REFERENCES predictions(id),
  confidence_level VARCHAR(50),
  xp_earned INTEGER DEFAULT 0,
  is_correct BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Match Stats Table
CREATE TABLE IF NOT EXISTS match_stats (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  team_id INTEGER NOT NULL REFERENCES teams(id),
  possession DECIMAL(5, 2),
  shots INTEGER,
  shots_on_target INTEGER,
  passes INTEGER,
  tackles INTEGER,
  expected_goals DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Odds Table
CREATE TABLE IF NOT EXISTS odds (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  bookmaker VARCHAR(100),
  home_win_odds DECIMAL(5, 2),
  draw_odds DECIMAL(5, 2),
  away_win_odds DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id)
);

-- Live Events Table
CREATE TABLE IF NOT EXISTS live_events (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id),
  minute INTEGER,
  event_type VARCHAR(50),
  team_id INTEGER REFERENCES teams(id),
  player_name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Indexes for performance
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_league ON matches(league);
CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_user_predictions_user ON user_predictions(user_id);
CREATE INDEX idx_live_events_match ON live_events(match_id);
CREATE INDEX idx_match_stats_match ON match_stats(match_id);
