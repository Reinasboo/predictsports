'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  glow?: 'cyan' | 'purple' | 'none'
}

export const GlassCard = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = 'cyan',
}: GlassCardProps) => {
  const glowClass = {
    cyan: 'hover:shadow-glow hover:shadow-cyan-500/50',
    purple: 'hover:shadow-glow-purple',
    none: '',
  }[glow]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hoverable ? { y: -8 } : undefined}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-blue-900/40 via-slate-900/40 to-black/60
        border border-cyan-500/20
        backdrop-blur-xl
        shadow-glass
        transition-all duration-300
        ${hoverable ? 'cursor-pointer' : ''}
        ${glowClass}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export default GlassCard
