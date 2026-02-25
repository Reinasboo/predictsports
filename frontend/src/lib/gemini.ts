/**
 * Gemini API Integration Service
 * Provides AI-powered reasoning and explanations for match predictions
 * Does NOT modify prediction math - only adds explanations
 */

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

interface PredictionData {
  homeTeam: string
  awayTeam: string
  homeWinProb: number
  drawProb: number
  awayWinProb: number
  competitionName?: string
  expectedGoalsHome?: number
  expectedGoalsAway?: number
  confidence?: 'high' | 'medium' | 'low'
}

interface GeminiResponse {
  insight: string
  confidence_reason?: string
  key_factors?: string[]
}

/**
 * Generate an AI insight for a specific prediction
 * Explains why the model predicts a certain outcome
 */
export async function generateMatchInsight(prediction: PredictionData): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    return {
      insight: `${prediction.homeTeam} has a ${prediction.homeWinProb}% win probability against ${prediction.awayTeam}.`,
    }
  }

  try {
    const prompt = `You are a professional football (soccer) analyst. Provide a brief, neutral analysis of this prediction in 2-3 sentences.

Match: ${prediction.homeTeam} vs ${prediction.awayTeam}
Competition: ${prediction.competitionName || 'Unknown'}

Model Predictions:
- ${prediction.homeTeam} Win: ${prediction.homeWinProb}%
- Draw: ${prediction.drawProb}%
- ${prediction.awayTeam} Win: ${prediction.awayWinProb}%

${prediction.expectedGoalsHome ? `Expected Goals - ${prediction.homeTeam}: ${prediction.expectedGoalsHome}` : ''}
${prediction.expectedGoalsAway ? `Expected Goals - ${prediction.awayTeam}: ${prediction.expectedGoalsAway}` : ''}

Confidence Level: ${prediction.confidence || 'medium'}

Provide a concise explanation of the prediction focusing on:
1. Why this prediction makes sense
2. Any notable factors

Keep response analytical and avoid hype. Be neutral and factual.`

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      console.warn('Gemini API error:', response.statusText)
      return {
        insight: `${prediction.homeTeam} has a ${prediction.homeWinProb}% win probability. The prediction suggests ${prediction.homeWinProb > 50 ? `${prediction.homeTeam} are favorites.` : `the match is competitive.`}`,
      }
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      insight: content || `${prediction.homeTeam} is predicted to have a ${prediction.homeWinProb}% chance of winning.`,
      confidence_reason: `Based on expected goals and team form analysis.`,
    }
  } catch (error) {
    console.error('Error generating Gemini insight:', error)
    // Fallback response
    return {
      insight: `${prediction.homeTeam} has a ${prediction.homeWinProb}% win probability against ${prediction.awayTeam}.`,
    }
  }
}

/**
 * Generate a brief scenario explanation
 */
export async function generateScenarioExplanation(
  scenario: string,
  probability: number,
  context: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return `${scenario} has a ${probability}% probability based on historical data.`
  }

  try {
    const prompt = `As a football analyst, briefly explain why "${scenario}" has a ${probability}% probability in this context: ${context}

Keep the response to exactly 1 sentence. Be analytical and neutral.`

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 60,
        },
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return `${scenario} is predicted with ${probability}% confidence.`
    }

    const data = await response.json()
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return explanation || `${scenario} is predicted with ${probability}% confidence.`
  } catch (error) {
    console.error('Error generating scenario explanation:', error)
    return `${scenario} is predicted with ${probability}% confidence.`
  }
}

/**
 * Check if Gemini API is properly configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY
}

export default {
  generateMatchInsight,
  generateScenarioExplanation,
  isGeminiConfigured,
}
