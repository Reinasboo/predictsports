import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  color?: 'cyan' | 'purple' | 'green' | 'orange'
  trend?: { direction: 'up' | 'down'; value: string }
  onClick?: () => void
}

const colorClasses = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
}

const bgClasses = {
  cyan: 'from-cyan-500/10 to-blue-500/5 border-cyan-400/30',
  purple: 'from-purple-500/10 to-pink-500/5 border-purple-400/30',
  green: 'from-green-500/10 to-emerald-500/5 border-green-400/30',
  orange: 'from-orange-500/10 to-red-500/5 border-orange-400/30',
}

export default function StatCard({
  icon,
  label,
  value,
  color = 'cyan',
  trend,
  onClick,
}: StatCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-lg p-6 border bg-gradient-to-br ${bgClasses[color]} transition-all text-left w-full`}
    >
      {/* Animated Background Glow */}
      <motion.div
        className={`absolute inset-0 opacity-0 ${colorClasses[color]}`}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative">
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={`${colorClasses[color]} mb-3`}
        >
          {icon}
        </motion.div>

        {/* Content */}
        <p className="text-gray-400 text-sm mb-2">{label}</p>

        <div className="flex items-baseline gap-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.p>

          {trend && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-sm font-semibold ${
                trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
