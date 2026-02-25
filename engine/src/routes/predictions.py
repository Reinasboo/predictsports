from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.models.ensemble import PredictionEngine
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
engine = PredictionEngine()

class MatchInput(BaseModel):
    home_team_id: int
    away_team_id: int
    home_form: str = "WWW"
    away_form: str = "WWW"
    home_xg: float = 1.5
    away_xg: float = 1.2
    home_possession: float = 50
    away_possession: float = 50
    home_defensive_rating: float = 0.75
    away_defensive_rating: float = 0.75
    is_home_advantage: bool = True

@router.post("/predict")
async def predict_match(match: MatchInput):
    """Generate predictions for a match"""
    try:
        match_data = match.dict()
        
        # Get ensemble predictions
        prediction = engine.predict_match(match_data)
        
        # Generate scorelines
        features = engine.engineer_features(match_data)
        scorelines = engine.generate_scorelines(features)
        
        # Calculate goal markets
        home_lambda = features['home_strength'] * features['home_xg']
        away_lambda = features['away_strength'] * features['away_xg']
        
        total_goals_probs = {}
        for total in [0.5, 1.5, 2.5, 3.5]:
            prob = sum(
                np.exp(-home_lambda) * (home_lambda ** i) / np.math.factorial(i) *
                np.exp(-away_lambda) * (away_lambda ** j) / np.math.factorial(j)
                for i in range(int(total) + 1)
                for j in range(int(total) + 1)
                if i + j >= total
            )
            total_goals_probs[f'over_{int(total)}'] = float(prob)
        
        return {
            "success": True,
            "match_id": f"{match.home_team_id}_vs_{match.away_team_id}",
            "predictions": {
                "probabilities": prediction,
                "scorelines": scorelines,
                "goal_markets": total_goals_probs,
            }
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@router.post("/analyze")
async def analyze_match(match: MatchInput):
    """Detailed match analysis"""
    try:
        prediction = engine.predict_match(match.dict())
        
        return {
            "success": True,
            "analysis": {
                "predicted_outcome": max(prediction['home_win'], prediction['draw'], prediction['away_win']),
                "confidence_level": prediction['confidence'],
                "model_agreement": prediction['model_agreement'],
                "key_factors": [
                    f"Form difference: {match.home_form} vs {match.away_form}",
                    f"Expected goals: {match.home_xg} vs {match.away_xg}",
                    f"Home advantage considered" if match.is_home_advantage else "No home advantage",
                ]
            }
        }
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Analysis failed")

import numpy as np
