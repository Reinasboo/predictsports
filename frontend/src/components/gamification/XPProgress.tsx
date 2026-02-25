'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'


interface XPProgressProps {
  currentXP: number
  nextLevelXP: number
  level: number
  showLevel?: boolean
  animated?: boolean
}

export const XPProgress = ({
  currentXP,
  nextLevelXP,
  level,
  showLevel = true,
  animated = true,
}: XPProgressProps) => {
  const [displayXP, setDisplayXP] = useState(0)
  const percentage = (currentXP / nextLevelXP) * 100

  useEffect(() => {
    if (!animated) {
      setDisplayXP(currentXP)
      return
    }

    let animationFrameId: number
    const startTime = Date.now()
    const duration = 1000

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayXP(Math.round(currentXP * progress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [currentXP, animated])

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showLevel && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-black text-white shadow-glow"
            >
              {level}
            </motion.div>
          )}
          <div>
            <p className="text-xs text-gray-400 font-semibold">LEVEL UP</p>
            <p className="text-sm font-bold text-cyan-300">{displayXP} XP</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      </div>

      <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden border border-cyan-500/20">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-glow"
          layoutId="xp-bar"
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>

      <p className="text-xs text-gray-400 text-center">
        {nextLevelXP - currentXP} XP until level {level + 1}
      </p>
    </div>
  )
}

export default XPProgress
