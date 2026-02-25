import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { mockLeaderboard } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const medalColors = {
  1: 'from-yellow-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-orange-400 to-orange-600',
}

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '⭐'
}

export default function Leaderboard() {
  return (
    <GlassCard glow="cyan">
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <Trophy className="text-yellow-400" size={28} />
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {mockLeaderboard.map((player) => {
            const isCurrentUser = player.id === 4
            return (
              <motion.div
                key={player.id}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-lg transition-all ${
                  isCurrentUser
                    ? 'ring-2 ring-cyan-400/50 bg-cyan-400/10'
                    : 'bg-slate-800/50'
                }`}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {/* Gradient Background for Top 3 */}
                {player.rank <= 3 && (
                  <motion.div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-r ${
                      medalColors[player.rank as 1 | 2 | 3] || ''
                    }`}
                  />
                )}

                <div className="relative p-4 flex items-center gap-4">
                  {/* Rank Badge */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex-shrink-0"
                  >
                    <span className="text-xl font-bold">
                      {getMedalEmoji(player.rank)}
                    </span>
                  </motion.div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">
                        {player.username}
                      </p>
                      {player.rank <= 3 && (
                        <motion.span
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-950 px-2 py-0.5 rounded-full font-bold"
                        >
                          Top {player.rank}
                        </motion.span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Level {player.level}</span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        {player.accuracy}%
                      </span>
                    </div>
                  </div>

                  {/* XP Display */}
                  <div className="text-right">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-cyan-400"
                    >
                      {(player.xp / 1000).toFixed(1)}K
                    </motion.p>
                    <p className="text-xs text-gray-500">XP</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-semibold hover:from-cyan-300 hover:to-blue-400 transition-all"
        >
          View Full Leaderboard
        </motion.button>
      </div>
    </GlassCard>
  )
}
