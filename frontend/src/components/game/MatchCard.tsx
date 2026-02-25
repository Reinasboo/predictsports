'use client'

import { motion } from 'framer-motion'
import { Clock, Zap } from 'lucide-react'
import ProbabilityBar from '@/components/ui/ProbabilityBar'

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string
  awayTeamLogo?: string
  homeWinProb: number
  drawProb: number
  awayWinProb: number
  kickoffTime: string
  confidence: 'high' | 'medium' | 'low'
  competitionName?: string
  onClick?: () => void
}

export const MatchCard = ({
  homeTeam,
  awayTeam,
  homeWinProb,
  drawProb,
  awayWinProb,
  kickoffTime,
  confidence,
  competitionName,
  onClick,
}: MatchCardProps) => {
  const confidenceColor = {
    high: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500',
    low: 'from-red-500 to-pink-500',
  }[confidence]

  const confidenceText = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  }[confidence]

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900/40 to-black/60 border border-cyan-500/20 backdrop-blur-xl shadow-glass hover:shadow-glow transition-all duration-300 p-6">
        {/* Background glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              {competitionName && (
                <p className="text-xs text-cyan-400 font-semibold mb-1">{competitionName}</p>
              )}
              <div className="flex items-center gap-2 text-cyan-300 text-sm">
                <Clock size={14} />
                <span>{kickoffTime}</span>
              </div>
            </div>
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${confidenceColor} text-white`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {confidenceText}
            </motion.div>
          </div>

          {/* Teams */}
          <div className="flex justify-between items-center py-4">
            <div className="text-center flex-1">
              <p className="text-sm font-bold text-white mb-2">{homeTeam}</p>
              <p className="text-2xl font-black text-cyan-400">{Math.round(homeWinProb)}%</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Draw</p>
              <p className="text-xl font-bold text-purple-400">{Math.round(drawProb)}%</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm font-bold text-white mb-2">{awayTeam}</p>
              <p className="text-2xl font-black text-cyan-400">{Math.round(awayWinProb)}%</p>
            </div>
          </div>

          {/* Expected Goals */}
          <div className="pt-4 border-t border-cyan-500/10">
            <p className="text-xs text-gray-400 mb-2 font-semibold">Win Probability</p>
            <div className="space-y-2">
              <ProbabilityBar percentage={homeWinProb} label={homeTeam} color="cyan" animated={false} />
              <ProbabilityBar percentage={drawProb} label="Draw" color="purple" animated={false} />
              <ProbabilityBar percentage={awayWinProb} label={awayTeam} color="cyan" animated={false} />
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:shadow-glow transition-all"
          >
            <Zap size={14} className="inline mr-2" />
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default MatchCard
