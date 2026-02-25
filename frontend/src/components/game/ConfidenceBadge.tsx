'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface ConfidenceBadgeProps {
  confidence: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  pulse?: boolean
}

export const ConfidenceBadge = ({
  confidence,
  size = 'md',
  label,
  pulse = true,
}: ConfidenceBadgeProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  }

  const getColor = (conf: number) => {
    if (conf >= 75) return 'from-green-500 to-emerald-500'
    if (conf >= 50) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
      className={`
        relative flex items-center justify-center rounded-full
        bg-gradient-to-br ${getColor(confidence)}
        shadow-glow
        ${sizeClasses[size]}
      `}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      <div className="relative z-10 text-center">
        <TrendingUp className="mx-auto mb-1" size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />
        <p className="font-black">{confidence}%</p>
        {label && <p className="text-xs font-semibold">{label}</p>}
      </div>
    </motion.div>
  )
}

export default ConfidenceBadge
