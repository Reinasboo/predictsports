'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Clock, MapPin, Zap } from 'lucide-react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import MatchCard from '@/components/game/MatchCard'
import ScenarioCard from '@/components/game/ScenarioCard'
import StatCard from '@/components/ui/StatCard'
import GlowButton from '@/components/ui/GlowButton'
import { mockMatches, mockScenarios } from '@/lib/mock-data'

export default function MatchDetailPage() {
  // Use first match as example
  const match = mockMatches[0]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-8"
      >
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all">
            <ArrowLeft size={20} />
            Back
          </button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 transition-all"
        >
          <Share2 size={20} className="text-slate-950" />
        </motion.button>
      </motion.div>

      {/* Match Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MatchCard {...match} />
      </motion.div>

      {/* Match Info Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Clock size={24} />}
            label="Kickoff Time"
            value={match.kickoffTime}
            color="cyan"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<MapPin size={24} />}
            label="Competition"
            value={match.competitionName}
            color="purple"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Zap size={24} />}
            label="Model Confidence"
            value="82%"
            color="green"
            trend={{ direction: 'up', value: '+5%' }}
          />
        </motion.div>
      </motion.div>

      {/* Expected Goals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Expected Goals (xG) Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Team xG */}
          <GlassCard glow="cyan">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.homeTeam}
                  </h3>
                  <p className="text-gray-400 text-sm">Home Team</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl font-bold text-cyan-400"
                >
                  {match.expectedGoalsHome.toFixed(1)}
                </motion.div>
              </div>

              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                65% of total expected goals
              </p>
            </div>
          </GlassCard>

          {/* Away Team xG */}
          <GlassCard glow="purple">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {match.awayTeam}
                  </h3>
                  <p className="text-gray-400 text-sm">Away Team</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                  className="text-5xl font-bold text-purple-400"
                >
                  {match.expectedGoalsAway.toFixed(1)}
                </motion.div>
              </div>

              <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                35% of total expected goals
              </p>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Prediction Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">Prediction Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <ScenarioCard {...scenario} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
        <GlassCard glow="cyan">
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">Key Findings</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">→</span>
                  Manchester City has dominated possession in 8 of last 10
                  matches
                </li>
                <li className="flex gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">→</span>
                  Liverpool's defensive line is vulnerable to quick counters
                </li>
                <li className="flex gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">→</span>
                  Historical xG ratio suggests 2.8:1.2 goal expectation
                </li>
              </ul>
            </div>

            <div className="border-t border-cyan-400/20 pt-4">
              <h3 className="font-semibold text-cyan-400 mb-2">
                Recommendation
              </h3>
              <p className="text-sm text-gray-300">
                The model strongly favors a Manchester City win with high
                confidence. The expected goal ratio and team form suggest a
                likely home victory. Recommended predictions: Home Win, Over
                2.5 Goals.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3 flex-wrap"
      >
        <GlowButton variant="primary" size="md">
          Make Prediction
        </GlowButton>
        <GlowButton variant="secondary" size="md">
          Add to Watchlist
        </GlowButton>
        <GlowButton variant="secondary" size="md">
          Share Analysis
        </GlowButton>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  )
}
