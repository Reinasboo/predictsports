'use client'

// Using 'use client' - React not needed as explicit import
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  requirement: string
}

const badges: Badge[] = [
  {
    id: 'prediction-master',
    name: 'Prediction Master',
    description: 'Make 100+ accurate predictions',
    icon: '🎯',
    requirement: '100+ accuracy',
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: 'form-analyzer',
    name: 'Form Analyzer',
    description: 'Analyze 50+ unique teams',
    icon: '📊',
    requirement: 'Analyze 50 teams',
  },
  {
    id: 'streak-champion',
    name: 'Streak Champion',
    description: 'Achieve 10+ prediction streak',
    icon: '🔥',
    requirement: '10 streak',
    unlockedAt: new Date('2024-02-10'),
  },
  {
    id: 'data-expert',
    name: 'Data Expert',
    description: 'Achieve 70%+ accuracy rate',
    icon: '📈',
    requirement: '70%+ accuracy',
    unlockedAt: new Date('2024-01-20'),
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Join the platform in the first month',
    icon: '⚡',
    requirement: 'First month',
    unlockedAt: new Date('2023-12-01'),
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Make 50 predictions on weekends',
    icon: '🌙',
    requirement: '50 weekend predictions',
  },
  {
    id: 'underdog-specialist',
    name: 'Underdog Specialist',
    description: 'Predict 20+ upset victories correctly',
    icon: '🐕',
    requirement: '20 upset predictions',
  },
  {
    id: 'consistency-master',
    name: 'Consistency Master',
    description: 'Maintain 60%+ accuracy over 100 predictions',
    icon: '🎖️',
    requirement: '100 predictions @60%',
  },
]

export function Badges() {
  const unlockedCount = badges.filter((b) => b.unlockedAt).length

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="text-primary" size={24} />
          <div>
            <h3 className="text-xl font-bold">Achievements</h3>
            <p className="text-sm text-gray-400">{unlockedCount} of 8 unlocked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{unlockedCount}</p>
          <p className="text-xs text-gray-400">Badges</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            className={`p-3 rounded-lg text-center transition-all ${
              badge.unlockedAt
                ? 'bg-gradient-to-br from-primary/20 to-cyan-400/20 border border-primary/30'
                : 'bg-gray-800/50 border border-gray-700 opacity-60'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="text-xs font-semibold mb-1 line-clamp-2">{badge.name}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{badge.requirement}</p>
            {badge.unlockedAt && (
              <p className="text-xs text-primary mt-1">
                {badge.unlockedAt.toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Locked Badges Info */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400">
          Complete predictions and improve your accuracy to unlock more badges and climb the leaderboard!
        </p>
      </div>
    </motion.div>
  )
}
