'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Home, Trophy, TrendingUp, BarChart3, Menu, X } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <Trophy size={20} />, label: 'Matches', href: '/matches' },
  { icon: <TrendingUp size={20} />, label: 'Analytics', href: '/analytics' },
  { icon: <BarChart3 size={20} />, label: 'Leaderboard', href: '/leaderboard' },
]

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-neutral-800 z-50"
      >
        {/* Logo Section */}
        <div className="flex items-center px-8 gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-lg">⚽</span>
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-white">Predictsports</h1>
            <p className="text-xs text-neutral-500">AI Match Predictions</p>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-1 flex-1 mx-8">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              className="relative px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors group flex items-center gap-2"
            >
              <span className="text-blue-500 group-hover:text-blue-400 transition-colors">
                {item.icon}
              </span>
              {item.label}

              {/* Subtle Underline */}
              {activeTab === item.label.toLowerCase() && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 px-8">
          {/* Live Status */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/20 border border-blue-500/30"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-neutral-300">Live</span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 h-14 bg-bg-dark border-b border-blue-900/30 z-50 flex items-center justify-between px-4"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚽</span>
          </div>
          <div>
            <span className="text-base font-bold text-white">Predictsports</span>
            <p className="text-xs text-neutral-500">Live Predictions</p>
          </div>
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20,
        }}
        transition={{ duration: 0.2 }}
        className="md:hidden fixed top-14 left-0 right-0 bg-bg-darker/95 backdrop-blur-lg border-b border-blue-900/30 z-40"
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      >
        <div className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors text-sm"
              onClick={() => {
                setActiveTab(item.label.toLowerCase())
                setIsMobileMenuOpen(false)
              }}
            >
              <span className="text-blue-500">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Desktop Padding */}
      <div className="hidden md:block h-16" />
    </>
  )
}
