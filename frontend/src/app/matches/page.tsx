'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, TrendingUp } from 'lucide-react'
import MatchCard from '@/components/game/MatchCard'
import GlassCard from '@/components/ui/GlassCard'
import GlowButton from '@/components/ui/GlowButton'
import { mockMatches } from '@/lib/mock-data'

type FilterType = 'all' | 'high-confidence' | 'medium-confidence'
type SortType = 'kickoff' | 'confidence' | 'xg'

export default function MatchesPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('kickoff')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter matches
  const filteredMatches = mockMatches.filter((match) => {
    const matchesSearch =
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'high-confidence' && match.confidence === 'high') ||
      (filter === 'medium-confidence' && match.confidence === 'medium')

    return matchesSearch && matchesFilter
  })

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sort === 'confidence') {
      return b.homeWinProb - a.homeWinProb
    } else if (sort === 'xg') {
      return b.expectedGoalsHome - a.expectedGoalsHome
    }
    return 0
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          All Matches
        </h1>
        <p className="text-gray-400">
          Browse and make predictions on upcoming fixtures
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'high-confidence', 'medium-confidence', 'low-confidence'] as FilterType[]).map(
              (f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950'
                      : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {f === 'all'
                    ? 'All'
                    : f === 'high-confidence'
                      ? 'High Confidence'
                      : 'Medium'}
                </motion.button>
              )
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="kickoff">Sort by Kickoff</option>
            <option value="confidence">Sort by Confidence</option>
            <option value="xg">Sort by xG</option>
          </select>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-sm text-gray-400"
      >
        <TrendingUp size={16} />
        <span>Showing {sortedMatches.length} matches</span>
      </motion.div>

      {/* Matches Grid */}
      {sortedMatches.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {sortedMatches.map((match) => (
            <motion.div key={match.id} variants={itemVariants}>
              <MatchCard {...match} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <GlassCard glow="cyan">
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No matches found</p>
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setFilter('all')
              }}
            >
              Clear Filters
            </GlowButton>
          </div>
        </GlassCard>
      )}

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  )
}
