'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Home, BarChart3, Gamepad2, User } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Gameweek', href: '/gameweek', icon: Gamepad2 },
    { label: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex sticky top-0 z-50 glass-dark border-b justify-between items-center px-8 py-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
          ⚡ Predictsports
        </Link>

        <div className="flex gap-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <button className="btn-primary">Sign In</button>
      </nav>

      {/* Mobile Navigation */}
      <motion.nav className="md:hidden sticky top-0 z-50 glass-dark border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            ⚡ PS
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.nav>
    </>
  )
}
