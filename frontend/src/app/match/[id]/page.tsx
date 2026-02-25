'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fixtureService, predictionService } from '@/services/api'
import { PredictionBars, ConfidenceBadge, GoalsMeter } from '@/components/match/PredictionCharts'
import { ArrowLeft, Share2, Bell } from 'lucide-react'
import Link from 'next/link'

interface Match {
  id: string
  home_team_name: string
  away_team_name: string
  kickoff: string
  status: string
}

interface Prediction {
  home_win_probability: number
  draw_probability: number
  away_win_probability: number
  confidence: string
  model_agreement: number
}

export default function MatchDetail({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const matchRes = await fixtureService.getByDate(new Date().toISOString().split('T')[0])
        if (matchRes.data && matchRes.data.length > 0) {
          setMatch(matchRes.data[0])

          const predRes = await predictionService.getForMatch(params.id)
          setPrediction(predRes.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!match || !prediction) {
    return <div className="min-h-screen flex items-center justify-center">Match not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/gameweek" className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6">
            <ArrowLeft size={20} />
            Back to Gameweek
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 mb-2">MATCHDAY 15</p>
              <h1 className="text-4xl font-bold mb-2">
                {match.home_team_name} vs {match.away_team_name}
              </h1>
              <p className="text-gray-400">{new Date(match.kickoff).toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <button className="p-3 glass rounded-lg hover:border-primary transition">
                <Bell size={20} />
              </button>
              <button className="p-3 glass rounded-lg hover:border-primary transition">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Panel */}
          <motion.div
            className="lg:col-span-2 card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">AI Prediction</h2>

            <div className="mb-8">
              <ConfidenceBadge confidence={prediction.confidence as any} />
            </div>

            <PredictionBars
              homeWin={prediction.home_win_probability}
              draw={prediction.draw_probability}
              awayWin={prediction.away_win_probability}
            />
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <p className="text-sm text-gray-400 mb-2">Model Agreement</p>
              <p className="text-3xl font-bold text-primary">{(prediction.model_agreement * 100).toFixed(0)}%</p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-400 mb-2">Data Score</p>
              <p className="text-3xl font-bold text-accent">85%</p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-400 mb-2">Market Signal</p>
              <p className="text-3xl font-bold text-secondary">2.45</p>
            </div>
          </motion.div>
        </div>

        {/* Goals Distribution */}
        <motion.div
          className="card mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-6">Expected Goals Distribution</h3>
          <GoalsMeter />
        </motion.div>
      </div>
    </div>
  )
}
