'use client'

import { motion } from 'framer-motion'
import { User, Settings, LogOut, Copy } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import GlassCard from '@/components/ui/GlassCard'
import GlowButton from '@/components/ui/GlowButton'
import Leaderboard from '@/components/gamification/Leaderboard'
import Achievements from '@/components/gamification/Achievements'
import { mockGamificationData } from '@/lib/mock-data'

export default function ProfilePage() {
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
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8"
      >
        <GlassCard glow="cyan">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl shadow-lg shadow-cyan-400/50"
              >
                ⚡
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Champion Predictor</h1>
                <p className="text-gray-400 mb-4">
                  @yourhandle • Joined 6 months ago
                </p>

                <div className="flex gap-2 mb-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-semibold"
                  >
                    🏆 Rank #4
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full text-yellow-300 text-sm font-semibold"
                  >
                    ⭐ Level {mockGamificationData.level}
                  </motion.span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <GlowButton variant="secondary" size="sm" className="flex items-center gap-2">
                    <Copy size={16} />
                    Copy Profile Link
                  </GlowButton>
                  <GlowButton
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </GlowButton>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Your Status</p>
                <p className="text-3xl font-bold text-cyan-400">Active</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<span className="text-2xl">🎯</span>}
            label="Total Predictions"
            value={mockGamificationData.predictions}
            color="cyan"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<span className="text-2xl">📈</span>}
            label="Win Rate"
            value={`${mockGamificationData.accuracy}%`}
            color="green"
            trend={{ direction: 'up', value: '+3%' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<span className="text-2xl">🔥</span>}
            label="Current Streak"
            value={mockGamificationData.streak}
            color="orange"
            trend={{ direction: 'up', value: '+2' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<span className="text-2xl">⚡</span>}
            label="Total XP"
            value={`${(mockGamificationData.totalXP / 1000).toFixed(1)}K`}
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">Performance Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accuracy by Competition */}
          <GlassCard glow="cyan">
            <div className="p-6">
              <h3 className="font-semibold text-cyan-400 mb-4">
                Accuracy by Competition
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Premier League', rate: 72, color: 'from-cyan-400 to-blue-500' },
                  { name: 'La Liga', rate: 65, color: 'from-purple-400 to-pink-500' },
                  { name: 'Bundesliga', rate: 70, color: 'from-green-400 to-emerald-500' },
                  { name: 'Ligue 1', rate: 63, color: 'from-orange-400 to-red-500' },
                ].map((comp) => (
                  <div key={comp.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{comp.name}</span>
                      <span className="text-sm font-semibold text-cyan-400">
                        {comp.rate}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${comp.rate}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${comp.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Prediction Types */}
          <GlassCard glow="purple">
            <div className="p-6">
              <h3 className="font-semibold text-purple-400 mb-4">
                Prediction Type Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'Home Win', count: 18, percent: 38 },
                  { type: 'Draw', count: 8, percent: 17 },
                  { type: 'Away Win', count: 12, percent: 26 },
                  { type: 'Over/Under', count: 9, percent: 19 },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 w-20">{item.type}</span>
                    <div className="flex-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8 }}
                        className="relative h-6 bg-slate-800 rounded overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-end pr-2"
                        >
                          <span className="text-xs font-bold text-slate-950">
                            {item.percent}%
                          </span>
                        </motion.div>
                      </motion.div>
                    </div>
                    <span className="text-sm text-gray-500 w-12">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Leaderboard & Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Achievements />
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Ranking</h2>
          <Leaderboard />
        </div>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Account & Settings</h2>
        <GlassCard glow="cyan">
          <div className="p-6">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-800/50 transition-colors border border-slate-700 hover:border-cyan-400/50">
                <span className="flex items-center gap-3">
                  <User size={20} className="text-cyan-400" />
                  <span>Edit Profile</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-800/50 transition-colors border border-slate-700 hover:border-cyan-400/50">
                <span className="flex items-center gap-3">
                  <Settings size={20} className="text-cyan-400" />
                  <span>Preferences</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-900/30 transition-colors border border-slate-700 hover:border-red-400/50">
                <span className="flex items-center gap-3">
                  <LogOut size={20} className="text-red-400" />
                  <span>Sign Out</span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  )
}
