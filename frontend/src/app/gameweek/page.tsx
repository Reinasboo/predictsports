'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fixtureService } from '@/services/api'
import Link from 'next/link'

interface Match {
  id: string
  home_team_name: string
  away_team_name: string
  kickoff: string
  status: string
}

export default function Gameweek() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'finished'>('all')
  const [, setLoading] = useState(true)

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fixtureService.getAll()
        setMatches(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  const filteredMatches = filter === 'all' ? matches : matches.filter((m) => m.status === filter)

  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Matchday 15</h1>
          <p className="text-gray-400">Premier League • 42 predictions • Updated 2 mins ago</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['all', 'scheduled', 'live', 'finished'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f ? 'glass border-primary' : 'glass hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {f.toUpperCase()}
            </motion.button>
          ))}
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match, idx) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card hover:border-primary transition cursor-pointer"
            >
              <Link href={`/match/${match.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    match.status === 'live' ? 'bg-red-500/20 text-red-400' :
                    match.status === 'finished' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {match.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(match.kickoff).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-center">
                  <p className="font-semibold mb-2">{match.home_team_name}</p>
                  <div className="text-2xl font-bold text-primary mb-2">0 - 0</div>
                  <p className="font-semibold text-gray-300 mb-4">{match.away_team_name}</p>
                  <button className="w-full btn-primary text-sm">View Prediction</button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
