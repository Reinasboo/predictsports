'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Home, Trophy, BarChart3, User, Zap } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: <Home size={24} />, label: 'Home', href: '/dashboard' },
  { icon: <Trophy size={24} />, label: 'Matches', href: '/matches' },
  { icon: <Zap size={24} />, label: 'XP', href: '/xp', badge: 1250 },
  { icon: <BarChart3 size={24} />, label: 'Analytics', href: '/analytics' },
  { icon: <User size={24} />, label: 'Profile', href: '/profile' },
]

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent border-t border-cyan-500/20 backdrop-blur-lg z-50"
    >
      <div className="flex items-center justify-around h-full px-2 pt-2">
        {navItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => setActiveTab(item.label.toLowerCase())}
            className="relative flex flex-col items-center gap-1 w-16 py-2 group"
          >
            {/* Icon Container */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Background Glow on Active */}
              {activeTab === item.label.toLowerCase() && (
                <motion.div
                  layoutId="mobileglow"
                  className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div
                className={`text-2xl transition-colors ${
                  activeTab === item.label.toLowerCase()
                    ? 'text-cyan-400'
                    : 'text-gray-400 group-hover:text-cyan-300'
                }`}
              >
                {item.icon}
              </div>
            </motion.div>

            {/* Label */}
            <span
              className={`text-xs font-medium transition-colors ${
                activeTab === item.label.toLowerCase()
                  ? 'text-cyan-400'
                  : 'text-gray-400 group-hover:text-cyan-300'
              }`}
            >
              {item.label}
            </span>

            {/* Badge */}
            {item.badge && activeTab === item.label.toLowerCase() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 px-1.5 py-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-xs font-bold text-slate-950"
              >
                {item.badge}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.nav>

    /* Mobile Content Padding */
  )
}
