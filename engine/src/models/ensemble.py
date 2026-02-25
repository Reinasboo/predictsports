import numpy as np
from scipy.stats import poisson
import logging

logger = logging.getLogger(__name__)

class PredictionEngine:
    """Ensemble prediction model combining multiple algorithms"""
    
    def __init__(self):
        self.models = {
            'poisson': self.poisson_model,
            'logistic': self.logistic_model,
            'form': self.form_model,
            'tactical': self.tactical_model,
            'market': self.market_model,
        }
    
    def predict_match(self, match_data: dict) -> dict:
        """Generate ensemble predictions for a match"""
        
        # Extract features
        features = self.engineer_features(match_data)
        
        # Run all models
        predictions = {}
        for model_name, model_fn in self.models.items():
            predictions[model_name] = model_fn(features)
        
        # Ensemble: weighted average
        ensemble_prediction = self.ensemble_predictions(predictions)
        
        return ensemble_prediction
    
    def engineer_features(self, match_data: dict) -> dict:
        """Feature engineering from raw match data"""
        
        home_form = match_data.get('home_form', 'WWW')
        away_form = match_data.get('away_form', 'WWW')
        
        home_strength = self.calculate_form_index(home_form)
        away_strength = self.calculate_form_index(away_form)
        
        return {
            'home_strength': home_strength,
            'away_strength': away_strength,
            'home_xg': match_data.get('home_xg', 1.5),
            'away_xg': match_data.get('away_xg', 1.2),
            'home_possession': match_data.get('home_possession', 50),
            'away_possession': match_data.get('away_possession', 50),
            'home_defensive_rating': match_data.get('home_defensive_rating', 0.75),
            'away_defensive_rating': match_data.get('away_defensive_rating', 0.75),
            'is_home_advantage': match_data.get('is_home_advantage', True),
        }
    
    def calculate_form_index(self, form_string: str) -> float:
        """Calculate team form index (0-1)"""
        if not form_string:
            return 0.5
        
        weights = {'W': 1.0, 'D': 0.5, 'L': 0.0}
        scores = [weights.get(result, 0.5) for result in form_string]
        return np.mean(scores) if scores else 0.5
    
    def poisson_model(self, features: dict) -> dict:
        """Poisson goal distribution model"""
        
        home_lambda = features['home_strength'] * features['home_xg']
        away_lambda = features['away_strength'] * features['away_xg']
        
        # Calculate probabilities for 0-5 goals
        home_probs = [poisson.pmf(i, home_lambda) for i in range(6)]
        away_probs = [poisson.pmf(i, away_lambda) for i in range(6)]
        
        # Match outcomes
        home_win = sum(home_probs[i] * sum(away_probs[:i]) for i in range(1, 6))
        away_win = sum(away_probs[i] * sum(home_probs[:i]) for i in range(1, 6))
        draw = sum(home_probs[i] * away_probs[i] for i in range(6))
        
        return {
            'home_win': float(home_win),
            'draw': float(draw),
            'away_win': float(away_win),
        }
    
    def logistic_model(self, features: dict) -> dict:
        """Logistic regression model"""
        
        strength_diff = features['home_strength'] - features['away_strength']
        home_advantage_boost = 0.3 if features['is_home_advantage'] else 0
        
        z = strength_diff + home_advantage_boost
        
        # Sigmoid function
        prob_home = 1 / (1 + np.exp(-z))
        prob_away = 1 - prob_home
        prob_draw = 0.25 * (1 - abs(strength_diff))
        
        # Normalize
        total = prob_home + prob_draw + prob_away
        
        return {
            'home_win': float(prob_home / total),
            'draw': float(prob_draw / total),
            'away_win': float(prob_away / total),
        }
    
    def form_model(self, features: dict) -> dict:
        """Form-based model"""
        
        home_strength = features['home_strength']
        away_strength = features['away_strength']
        
        return {
            'home_win': float(0.5 + (home_strength - away_strength) * 0.3),
            'draw': float(0.25),
            'away_win': float(0.25 - (home_strength - away_strength) * 0.3),
        }
    
    def tactical_model(self, features: dict) -> dict:
        """Tactical matchup model"""
        
        # Simple tactical advantage: possession + xG
        home_tactical = features['home_possession'] / 100 + features['home_xg'] / 3
        away_tactical = features['away_possession'] / 100 + features['away_xg'] / 3
        
        total = home_tactical + away_tactical
        home_prob = home_tactical / total
        away_prob = away_tactical / total
        
        return {
            'home_win': float(home_prob * 0.65),
            'draw': float(0.25),
            'away_win': float(away_prob * 0.65),
        }
    
    def market_model(self, features: dict) -> dict:
        """Market-based model using odds and rating differences"""
        
        # Simulate market odds model
        rating_diff = features['home_strength'] - features['away_strength']
        home_advantage = 0.15 if features['is_home_advantage'] else 0
        
        market_home = 0.5 + rating_diff * 0.25 + home_advantage
        market_away = 1 - market_home - 0.25
        
        return {
            'home_win': float(np.clip(market_home, 0.1, 0.7)),
            'draw': float(0.25),
            'away_win': float(np.clip(market_away, 0.1, 0.7)),
        }
    
    def ensemble_predictions(self, predictions: dict) -> dict:
        """Combine predictions using weighted ensemble"""
        
        weights = {
            'poisson': 0.30,
            'logistic': 0.25,
            'form': 0.20,
            'tactical': 0.15,
            'market': 0.10,
        }
        
        home_win = sum(predictions[model]['home_win'] * weights[model] for model in weights if model in predictions)
        draw = sum(predictions[model]['draw'] * weights[model] for model in weights if model in predictions)
        away_win = sum(predictions[model]['away_win'] * weights[model] for model in weights if model in predictions)
        
        # Normalize
        total = home_win + draw + away_win
        
        return {
            'home_win': float(home_win / total),
            'draw': float(draw / total),
            'away_win': float(away_win / total),
            'model_agreement': self.calculate_agreement(predictions),
            'confidence': self.determine_confidence(home_win / total),
        }
    
    def calculate_agreement(self, predictions: dict) -> float:
        """Calculate how much models agree"""
        
        home_wins = [pred['home_win'] for pred in predictions.values()]
        agreement = 1 - np.std(home_wins)
        return float(np.clip(agreement, 0, 1))
    
    def determine_confidence(self, max_prob: float) -> str:
        """Determine confidence level"""
        if max_prob > 0.65:
            return 'very_high'
        elif max_prob > 0.55:
            return 'high'
        elif max_prob > 0.48:
            return 'medium'
        else:
            return 'low'
    
    def generate_scorelines(self, features: dict, top_n: int = 5) -> list:
        """Generate likely scorelines"""
        
        home_lambda = features['home_strength'] * features['home_xg']
        away_lambda = features['away_strength'] * features['away_xg']
        
        scorelines = []
        for home_score in range(6):
            for away_score in range(6):
                prob = poisson.pmf(home_score, home_lambda) * poisson.pmf(away_score, away_lambda)
                scorelines.append({
                    'score': f'{home_score}-{away_score}',
                    'probability': float(prob)
                })
        
        # Sort by probability and return top N
        scorelines.sort(key=lambda x: x['probability'], reverse=True)
        return scorelines[:top_n]
