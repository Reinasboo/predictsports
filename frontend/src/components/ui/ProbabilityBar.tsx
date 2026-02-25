'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ProbabilityBarProps {
  percentage: number
  label?: string
  color?: 'cyan' | 'green' | 'purple' | 'orange'
  animated?: boolean
}

export const ProbabilityBar = ({
  percentage,
  label,
  color = 'cyan',
  animated = true,
}: ProbabilityBarProps) => {
  const [displayPercent, setDisplayPercent] = useState(0)

  useEffect(() => {
    if (!animated) {
      setDisplayPercent(percentage)
      return
    }

    let animationFrameId: number
    const startTime = Date.now()
    const duration = 800

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayPercent(Math.round(percentage * progress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [percentage, animated])

  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500 shadow-glow',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  }

  return (
    <div className="space-y-2">
      {(label || animated) && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300 font-medium">{label}</span>
          <span className="text-cyan-400 font-bold text-lg">{displayPercent}%</span>
        </div>
      )}
      <div className="relative h-3 bg-slate-900/50 rounded-full overflow-hidden border border-cyan-500/20">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default ProbabilityBar
