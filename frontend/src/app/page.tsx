'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const fixtures = [
    { id: 1, home: 'Manchester United', away: 'Liverpool', time: '15:00', status: 'live' },
    { id: 2, home: 'Bayern Munich', away: 'Dortmund', time: '18:30', status: 'upcoming' },
    { id: 3, home: 'Real Madrid', away: 'Barcelona', time: '21:00', status: 'upcoming' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <motion.section
        className="px-4 py-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-neon bg-clip-text text-transparent">
          Predictsports
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          AI-Powered Football Analytics & Prediction Platform
        </p>
      </motion.section>

      {/* Live Fixtures */}
      <motion.section
        className="max-w-6xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Zap className="text-primary" />
          Live Matches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fixtures.map((fixture) => (
            <motion.div
              key={fixture.id}
              variants={itemVariants}
              className="glass p-6 rounded-lg hover:border-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/20 text-primary">
                  {fixture.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">{fixture.time}</span>
              </div>

              <div className="text-center">
                <p className="font-semibold mb-2">{fixture.home}</p>
                <div className="text-2xl font-bold text-primary mb-2">0 - 0</div>
                <p className="font-semibold text-gray-300">{fixture.away}</p>
              </div>

              <Link href={`/match/${fixture.id}`} className="block mt-4 btn-primary text-center">
                View Prediction
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="text-accent" />
          Your Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Predictions', value: '142', icon: '📊' },
            { label: 'Accuracy', value: '67%', icon: '🎯' },
            { label: 'XP', value: '2,540', icon: '⭐' },
            { label: 'Level', value: '12', icon: '🏆' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold mb-6">Ready to master predictions?</h3>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">Start Predicting</button>
          <button className="px-6 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition">
            Explore Analytics
          </button>
        </div>
      </motion.section>
    </div>
  )
}
