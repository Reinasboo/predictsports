'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface GlowButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  loading?: boolean
  className?: string
}

export const GlowButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
}: GlowButtonProps) => {
  const variantClasses = {
    primary: 'from-cyan-500 to-blue-500 hover:shadow-glow text-white',
    secondary: 'from-purple-500 to-pink-500 hover:shadow-glow-purple text-white',
    danger: 'from-red-500 to-orange-500 hover:shadow-glow text-white',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-full
        bg-gradient-to-r ${variantClasses[variant]}
        font-semibold
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300
        inline-flex items-center justify-center gap-2
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : Icon ? (
          <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        ) : null}
        {children}
      </div>
    </motion.button>
  )
}

export default GlowButton
