'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import MatchCard from '@/components/game/MatchCard'
import XPProgress from '@/components/gamification/XPProgress'
import GlowButton from '@/components/ui/GlowButton'
import { mockMatches, mockGamificationData, mockInsights } from '@/lib/mock-data'
import { TrendingUp, Zap, Target } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-8 md:pt-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Welcome Card */}
          <GlassCard glow="cyan" className="md:col-span-2">
            <div className="p-6 md:p-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                Welcome Back, Champion! 🎯
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 mb-4"
              >
                You're on a 5-game prediction streak with 68% accuracy. Keep it up!
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 flex-wrap"
              >
                <GlowButton variant="primary" size="sm">
                  Start Predicting
                </GlowButton>
                <GlowButton variant="secondary" size="sm">
                  View Streak
                </GlowButton>
              </motion.div>
            </div>
          </GlassCard>

          {/* Stats Card */}
          <GlassCard glow="purple">
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Predictions</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {mockGamificationData.predictions}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                  <p className="text-3xl font-bold text-green-400">
                    {mockGamificationData.accuracy}%
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* XP Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="text-cyan-400" size={24} />
          Progression
        </h2>
        <GlassCard glow="cyan">
          <div className="p-6">
            <XPProgress
              level={mockGamificationData.level}
              currentXP={mockGamificationData.currentXP}
              nextLevelXP={mockGamificationData.nextLevelXP}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Featured Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-cyan-400" size={24} />
          Featured Matches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMatches.slice(0, 2).map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <MatchCard {...match} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-cyan-400" size={24} />
          AI Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard glow="cyan">
                <div className="p-4">
                  <p className="text-sm text-gray-200">{insight}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* All Matches Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's Matches</h2>
          <Link href="/matches">
            <GlowButton variant="secondary" size="sm">
              View All
            </GlowButton>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <MatchCard {...match} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  );
}
