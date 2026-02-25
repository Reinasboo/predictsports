'use client'

import { motion } from 'framer-motion'
import { Medal, TrendingUp, Zap } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  accuracy: number
  predictions: number
  xp: number
  badge?: string
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'ProAnalyst99',
    avatar: '👤',
    accuracy: 78.5,
    predictions: 542,
    xp: 12840,
    badge: '🏆',
  },
  {
    rank: 2,
    username: 'FormExpert',
    avatar: '👤',
    accuracy: 76.2,
    predictions: 468,
    xp: 11560,
    badge: '⭐',
  },
  {
    rank: 3,
    username: 'DataDriven',
    avatar: '👤',
    accuracy: 74.8,
    predictions: 421,
    xp: 10920,
    badge: '🥉',
  },
  {
    rank: 4,
    username: 'TacticalMind',
    avatar: '👤',
    accuracy: 72.1,
    predictions: 385,
    xp: 9840,
  },
  {
    rank: 5,
    username: 'MatchReader',
    avatar: '👤',
    accuracy: 70.9,
    predictions: 356,
    xp: 9100,
  },
]

export function Leaderboard() {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Medal className="text-primary" size={24} />
        <h2 className="text-2xl font-bold">Global Leaderboard</h2>
      </div>

      {/* Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 text-sm font-semibold text-gray-400 border-b border-gray-700 pb-3">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Player</div>
        <div className="col-span-2">Accuracy</div>
        <div className="col-span-2">Predictions</div>
        <div className="col-span-3">XP</div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-2">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg transition-all ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-primary/10 to-cyan-400/10 border border-primary/20'
                : 'hover:bg-gray-800/50'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400">
                <span className="font-bold text-sm">{entry.rank}</span>
              </div>
            </div>

            {/* Player */}
            <div className="col-span-4 md:col-span-4 flex items-center gap-3">
              <div className="text-2xl">{entry.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold">{entry.username}</p>
                {entry.badge && <span className="text-xs text-gray-400">{entry.badge}</span>}
              </div>
            </div>

            {/* Accuracy */}
            <div className="col-span-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                <span className="font-semibold">{entry.accuracy}%</span>
              </div>
            </div>

            {/* Predictions */}
            <div className="col-span-3 md:col-span-2 hidden md:flex items-center gap-2">
              <span className="font-semibold">{entry.predictions}</span>
            </div>

            {/* XP */}
            <div className="col-span-2 md:col-span-3 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="font-semibold">{entry.xp.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-primary to-cyan-400 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Full Leaderboard
      </motion.button>
    </motion.div>
  )
}
