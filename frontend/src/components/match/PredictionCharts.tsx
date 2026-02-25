'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PredictionBarsProps {
  homeWin: number
  draw: number
  awayWin: number
}

export function PredictionBars({ homeWin, draw, awayWin }: PredictionBarsProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Home Win</span>
          <span className="text-primary font-bold">{(homeWin * 100).toFixed(1)}%</span>
        </div>
        <motion.div
          className="h-2 bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${homeWin * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Draw</span>
          <span className="text-accent font-bold">{(draw * 100).toFixed(1)}%</span>
        </div>
        <motion.div
          className="h-2 bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${draw * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Away Win</span>
          <span className="text-secondary font-bold">{(awayWin * 100).toFixed(1)}%</span>
        </div>
        <motion.div
          className="h-2 bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${awayWin * 100}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export function GoalsMeter() {
  const data = [
    { name: '0-1', value: 20 },
    { name: '1-1', value: 25 },
    { name: '1-2', value: 18 },
    { name: '2-2', value: 20 },
    { name: '2+', value: 17 },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #00D9FF' }} />
          <Bar dataKey="value" fill="#00D9FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConfidenceBadge({ confidence }: { confidence: 'very_high' | 'high' | 'medium' | 'low' }) {
  const colors = {
    very_high: 'bg-green-500/20 text-green-400 border-green-500',
    high: 'bg-blue-500/20 text-blue-400 border-blue-500',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    low: 'bg-red-500/20 text-red-400 border-red-500',
  }

  return (
    <motion.div
      className={`px-4 py-2 rounded-lg border font-semibold text-center ${colors[confidence]}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      {confidence.replace('_', ' ').toUpperCase()} CONFIDENCE
    </motion.div>
  )
}
