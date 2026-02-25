-- Sample data for Predictsports

-- Insert competitions
INSERT INTO competitions (name, country, season, current_matchday, total_matchdays) VALUES
('Premier League', 'England', 2024, 15, 38),
('Bundesliga', 'Germany', 2024, 14, 34),
('La Liga', 'Spain', 2024, 14, 42),
('Serie A', 'Italy', 2024, 13, 38),
('Ligue 1', 'France', 2024, 13, 34)
ON CONFLICT DO NOTHING;

-- Insert teams
INSERT INTO teams (internal_team_id, name, country, founded, api_football_id) VALUES
('MAN_UNITED', 'Manchester United', 'England', 1878, 33),
('LIVERPOOL', 'Liverpool', 'England', 1892, 40),
('CHELSEA', 'Chelsea', 'England', 1905, 49),
('ARSENAL', 'Arsenal', 'England', 1886, 42),
('MAN_CITY', 'Manchester City', 'England', 1880, 50),
('BAYERN', 'Bayern Munich', 'Germany', 1900, 157),
('DORTMUND', 'Borussia Dortmund', 'Germany', 1909, 165),
('REAL_MADRID', 'Real Madrid', 'Spain', 1902, 541),
('BARCELONA', 'FC Barcelona', 'Spain', 1899, 529),
('ATLETICO', 'Atlético Madrid', 'Spain', 1903, 530)
ON CONFLICT (api_football_id) DO NOTHING;

-- Get competition IDs
DO $$
DECLARE
  v_pl_id UUID;
  v_bundes_id UUID;
BEGIN
  SELECT id INTO v_pl_id FROM competitions WHERE name = 'Premier League' LIMIT 1;
  SELECT id INTO v_bundes_id FROM competitions WHERE name = 'Bundesliga' LIMIT 1;

  -- Insert sample matches
  INSERT INTO matches (internal_match_id, home_team_id, away_team_id, competition_id, status, kickoff, venue)
  SELECT 
    'MATCH_' || ROW_NUMBER() OVER (ORDER BY generated_date),
    t1.id,
    t2.id,
    v_pl_id,
    CASE 
      WHEN generated_date < NOW() THEN 'finished'
      WHEN generated_date < NOW() + INTERVAL '2 hours' THEN 'live'
      ELSE 'scheduled'
    END,
    generated_date,
    'Stadium'
  FROM (
    SELECT NOW() + INTERVAL '1 day' * i AS generated_date
    FROM generate_series(1, 10) i
  ) dates,
  (SELECT id FROM teams WHERE country = 'England' ORDER BY RANDOM() LIMIT 2) AS t1_sub,
  (SELECT id FROM teams WHERE country = 'England' ORDER BY RANDOM() LIMIT 2 OFFSET 2) AS t2_sub,
  LATERAL (SELECT id FROM teams WHERE country = 'England' ORDER BY RANDOM() LIMIT 1) t1,
  LATERAL (SELECT id FROM teams WHERE country = 'England' WHERE id != t1.id ORDER BY RANDOM() LIMIT 1) t2
  ON CONFLICT DO NOTHING;

END $$;

-- Insert sample predictions
INSERT INTO predictions (match_id, home_win_probability, draw_probability, away_win_probability, over_2_5_probability, both_teams_score_probability, confidence, model_agreement, data_completeness)
SELECT 
  m.id,
  RANDOM() * 0.6,
  RANDOM() * 0.3,
  RANDOM() * 0.4,
  RANDOM() * 0.7,
  RANDOM() * 0.8,
  CASE 
    WHEN RANDOM() > 0.7 THEN 'very_high'
    WHEN RANDOM() > 0.5 THEN 'high'
    WHEN RANDOM() > 0.3 THEN 'medium'
    ELSE 'low'
  END,
  RANDOM() * 0.4 + 0.6,
  RANDOM() * 0.3 + 0.7
FROM matches m
WHERE m.predictions.count(*) = 0
LIMIT 20;

-- Insert sample odds
INSERT INTO odds (match_id, bookmaker, home_win, draw, away_win)
SELECT 
  m.id,
  'Betfair',
  2.5 + RANDOM(),
  3.0 + RANDOM(),
  2.8 + RANDOM()
FROM matches m
LIMIT 20;
