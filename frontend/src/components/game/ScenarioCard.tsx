'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ScenarioCardProps {
  icon: LucideIcon
  title: string
  description: string
  probability: number
  color: 'cyan' | 'purple' | 'orange'
  index?: number
}

export const ScenarioCard = ({
  icon: Icon,
  title,
  description,
  probability,
  color,
  index = 0,
}: ScenarioCardProps) => {
  const colorClass = {
    cyan: {
      gradient: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      text: 'text-cyan-400',
    },
    purple: {
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      text: 'text-purple-400',
    },
    orange: {
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30 hover:border-orange-500/60',
      text: 'text-orange-400',
    },
  }[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br ${colorClass.gradient}
        border ${colorClass.border}
        backdrop-blur-md
        p-6
        cursor-pointer
        group
        transition-all duration-300
      `}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-br from-white/10 to-transparent transition-opacity" />

      <div className="relative z-10 space-y-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className={`inline-block p-3 rounded-lg ${colorClass.gradient} `}
        >
          <Icon size={24} className={colorClass.text} />
        </motion.div>

        <div>
          <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
          <p className="text-xs text-gray-300">{description}</p>
        </div>

        <div className="pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-semibold">Probability</span>
            <span className={`text-lg font-black ${colorClass.text}`}>{probability}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ScenarioCard
