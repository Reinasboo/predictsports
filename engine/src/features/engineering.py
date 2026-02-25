"""
Feature Engineering Module
Generates comprehensive features for prediction models
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
import logging

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Generate features from match and team data"""

    @staticmethod
    def calculate_form_index(recent_results: list[str], weights: list[float] = None) -> float:
        """
        Calculate form index based on recent results
        W=3, D=1, L=0 points
        """
        if not recent_results:
            return 0.5

        if weights is None:
            weights = [1.0, 0.9, 0.8, 0.7, 0.6]  # Recency weighting

        form_score = 0
        for i, result in enumerate(recent_results[:5]):
            weight = weights[i] if i < len(weights) else 0.5
            points = {"W": 3, "D": 1, "L": 0}.get(result, 0)
            form_score += points * weight

        return form_score / (3 * sum(weights[:len(recent_results)]))

    @staticmethod
    def calculate_momentum_score(
        points_last_5: int, points_last_10: int, points_last_20: int
    ) -> float:
        """
        Calculate momentum - acceleration of form trend
        """
        trend = (points_last_5 - points_last_10) + (points_last_10 - points_last_20)
        return min(1.0, max(-1.0, trend / 45.0))  # Normalize to [-1, 1]

    @staticmethod
    def calculate_home_advantage(team_home_record: Dict[str, Any]) -> float:
        """
        Calculate home advantage coefficient (0.8 - 1.2)
        """
        home_win_rate = team_home_record.get("wins", 0) / max(
            team_home_record.get("played", 1), 1
        )
        league_avg_home_win = 0.46  # Typical league average
        advantage = home_win_rate - league_avg_home_win

        return min(1.0, max(-1.0, advantage * 2))  # Normalize and amplify

    @staticmethod
    def calculate_xg_differential(home_xg_avg: float, away_xg_avg: float) -> float:
        """
        Calculate expected goals differential
        """
        return (home_xg_avg - away_xg_avg) / max(home_xg_avg + away_xg_avg, 1.0)

    @staticmethod
    def calculate_defensive_stability_index(
        clean_sheets: int, goals_conceded: int, matches_played: int
    ) -> float:
        """
        Defense stability index: 0 to 1
        """
        clean_sheet_rate = clean_sheets / max(matches_played, 1)
        goals_per_game = goals_conceded / max(matches_played, 1)
        defensive_rating = clean_sheet_rate - (goals_per_game / 3)  # Normalize

        return min(1.0, max(0.0, defensive_rating))

    @staticmethod
    def calculate_fatigue_index(
        days_since_last_match: int, matches_in_last_14_days: int
    ) -> float:
        """
        Fatigue index: 0 (fresh) to 1 (exhausted)
        """
        rest_factor = min(1.0, days_since_last_match / 7.0)  # Peak freshness at 7+ days
        fixture_congestion = matches_in_last_14_days / 5.0  # Heavy at 5+ matches
        fatigue = (1.0 - rest_factor) + (fixture_congestion * 0.5)

        return min(1.0, max(0.0, fatigue))

    @staticmethod
    def calculate_rotation_risk_score(
        squad_depth: int, key_players_out: int, competition_stage: str
    ) -> float:
        """
        Risk of team rotation affecting performance
        0 = low risk, 1 = high risk
        """
        rotation_likelihood = key_players_out / max(squad_depth, 1)

        # Increase risk in group stages and early cups
        stage_modifier = {"early": 0.7, "mid": 0.5, "late": 0.2}.get(competition_stage, 0.5)

        return min(1.0, rotation_likelihood + stage_modifier)

    @staticmethod
    def calculate_motivation_index(
        previous_results: list[Dict],
        cup_participation: bool,
        championship_contention: bool,
    ) -> float:
        """
        Motivation pressure index based on context
        """
        # Recent results impact
        if previous_results and previous_results[-1]["result"] == "L":
            motivation = 0.7  # Boosted after loss
        elif previous_results and previous_results[-1]["result"] == "W":
            motivation = 0.6  # Slight boost to maintain
        else:
            motivation = 0.5  # Baseline

        # Cup competition boost
        if cup_participation:
            motivation += 0.15

        # Championship contention
        if championship_contention:
            motivation += 0.2

        return min(1.0, motivation)

    @staticmethod
    def calculate_weather_impact_modifier(
        weather_data: Dict[str, Any], team_weather_affinity: Dict[str, float]
    ) -> float:
        """
        Calculate impact of weather on team performance
        -1 = negative impact, 0 = neutral, 1 = positive
        """
        wind_speed = weather_data.get("wind_speed", 0)
        rain = weather_data.get("rain_probability", 0)
        temperature = weather_data.get("temperature", 15)

        # Base modifier
        modifier = 0

        # Wind impact (bad for technical teams)
        modifier -= wind_speed / 50 * team_weather_affinity.get("wind_resistance", 0.5)

        # Rain impact (can neutralize stronger team)
        modifier -= rain * team_weather_affinity.get("rain_affinity", 0.3)

        # Temperature (extreme temps can affect)
        temp_deviation = abs(temperature - 15) / 20  # 15C is ideal
        modifier -= temp_deviation * 0.2

        return min(1.0, max(-1.0, modifier))

    @staticmethod
    def calculate_referee_bias_score(
        referee_id: str, home_team_id: int, away_team_id: int, referee_data: Dict
    ) -> float:
        """
        Calculate referee bias score
        Positive = favors home team, Negative = favors away
        """
        if referee_id not in referee_data:
            return 0.0

        ref_stats = referee_data[referee_id]

        # Home win rate when this referee officiates
        home_bias = (ref_stats.get("home_wins", 0) - ref_stats.get("away_wins", 0)) / max(
            ref_stats.get("total_matches", 1), 1
        )

        # Card inconsistency
        card_variance = ref_stats.get("yellow_cards", 0) / max(ref_stats.get("total_matches", 1), 1)

        # Combine factors
        bias_score = (home_bias * 0.6) + ((card_variance - 4) / 10) * 0.4

        return min(1.0, max(-1.0, bias_score))

    @staticmethod
    def engineer_match_features(match_data: Dict[str, Any], historical_data: Dict) -> Dict[str, float]:
        """
        Generate all features for a match
        """
        home_team = match_data["home_team"]
        away_team = match_data["away_team"]

        features = {
            "form_index_home": FeatureEngineer.calculate_form_index(
                home_team.get("recent_results", [])
            ),
            "form_index_away": FeatureEngineer.calculate_form_index(
                away_team.get("recent_results", [])
            ),
            "momentum_home": FeatureEngineer.calculate_momentum_score(
                home_team.get("points_last_5", 0),
                home_team.get("points_last_10", 0),
                home_team.get("points_last_20", 0),
            ),
            "momentum_away": FeatureEngineer.calculate_momentum_score(
                away_team.get("points_last_5", 0),
                away_team.get("points_last_10", 0),
                away_team.get("points_last_20", 0),
            ),
            "home_advantage": FeatureEngineer.calculate_home_advantage(
                home_team.get("home_record", {})
            ),
            "xg_differential": FeatureEngineer.calculate_xg_differential(
                home_team.get("xg_avg", 1.5), away_team.get("xg_avg", 1.5)
            ),
            "defensive_stability_home": FeatureEngineer.calculate_defensive_stability_index(
                home_team.get("clean_sheets", 0),
                home_team.get("goals_conceded", 0),
                home_team.get("matches_played", 1),
            ),
            "defensive_stability_away": FeatureEngineer.calculate_defensive_stability_index(
                away_team.get("clean_sheets", 0),
                away_team.get("goals_conceded", 0),
                away_team.get("matches_played", 1),
            ),
            "fatigue_home": FeatureEngineer.calculate_fatigue_index(
                home_team.get("days_since_last_match", 7),
                home_team.get("matches_in_14_days", 1),
            ),
            "fatigue_away": FeatureEngineer.calculate_fatigue_index(
                away_team.get("days_since_last_match", 7),
                away_team.get("matches_in_14_days", 1),
            ),
            "rotation_risk_home": FeatureEngineer.calculate_rotation_risk_score(
                home_team.get("squad_depth", 20),
                home_team.get("key_players_out", 0),
                match_data.get("competition_stage", "mid"),
            ),
            "rotation_risk_away": FeatureEngineer.calculate_rotation_risk_score(
                away_team.get("squad_depth", 20),
                away_team.get("key_players_out", 0),
                match_data.get("competition_stage", "mid"),
            ),
            "motivation_home": FeatureEngineer.calculate_motivation_index(
                home_team.get("previous_results", []),
                match_data.get("home_cup_participation", False),
                home_team.get("championship_contention", False),
            ),
            "motivation_away": FeatureEngineer.calculate_motivation_index(
                away_team.get("previous_results", []),
                match_data.get("away_cup_participation", False),
                away_team.get("championship_contention", False),
            ),
            "weather_impact": FeatureEngineer.calculate_weather_impact_modifier(
                match_data.get("weather", {}),
                home_team.get("weather_affinity", {}),
            ),
            "referee_bias": FeatureEngineer.calculate_referee_bias_score(
                match_data.get("referee_id", ""),
                home_team.get("id", 0),
                away_team.get("id", 0),
                historical_data.get("referee_data", {}),
            ),
        }

        return features
