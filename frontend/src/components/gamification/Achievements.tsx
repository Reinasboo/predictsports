import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import { Star, Lock } from 'lucide-react'
import { mockGamificationData } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export default function Achievements() {
  const allBadges = [
    {
      id: 1,
      name: 'Perfect Week',
      icon: '⭐',
      description: 'Get all predictions correct in one week',
      achieved: true,
    },
    {
      id: 2,
      name: 'Hot Streak',
      icon: '🔥',
      description: '5-win streak',
      achieved: true,
    },
    {
      id: 3,
      name: 'Early Bird',
      icon: '🌅',
      description: 'Make predictions before 6 AM',
      achieved: false,
    },
    {
      id: 4,
      name: 'Prediction Master',
      icon: '🎯',
      description: 'Reach 70% accuracy',
      achieved: true,
    },
    {
      id: 5,
      name: 'Century Club',
      icon: '💯',
      description: 'Make 100 predictions',
      achieved: false,
    },
    {
      id: 6,
      name: 'Legendary',
      icon: '👑',
      description: 'Reach level 20',
      achieved: false,
    },
  ]

  const achievedCount = mockGamificationData.badges.length

  return (
    <GlassCard glow="purple">
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Star className="text-yellow-400" size={28} />
            Achievements
          </h2>
          <p className="text-gray-400 text-sm">
            {achievedCount} of {allBadges.length} badges unlocked
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 h-2 bg-slate-800 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(achievedCount / allBadges.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          />
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3"
        >
          {allBadges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={
                badge.achieved ? { y: -5 } : {}
              }
              className="relative group"
            >
              <div
                className={`relative p-4 rounded-lg text-center transition-all ${
                  badge.achieved
                    ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border border-cyan-400/50'
                    : 'bg-slate-800/30 border border-slate-700 opacity-50'
                }`}
              >
                {/* Badge Icon */}
                <motion.div
                  animate={badge.achieved ? { scale: [1, 1.2, 1] } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-2xl mb-2"
                >
                  {badge.achieved ? badge.icon : <Lock size={20} />}
                </motion.div>

                {/* Badge Name */}
                <p className="text-xs font-semibold text-white truncate">
                  {badge.name}
                </p>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 rounded whitespace-nowrap pointer-events-none"
                >
                  {badge.description}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Next Achievement Hint */}
        {achievedCount < allBadges.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-3 rounded-lg bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/30"
          >
            <p className="text-xs text-cyan-300">
              🎯 Next: Make predictions before 6 AM to unlock "Early Bird"
            </p>
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}
