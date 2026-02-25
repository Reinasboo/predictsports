'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Activity } from 'lucide-react'

interface MatchEvent {
  id: string
  timestamp: Date
  matchId: string
  team: string
  type: 'goal' | 'substitution' | 'yellow' | 'red' | 'start' | 'end'
  player: string
  minute: number
  description: string
  icon: string
}

const mockEvents: MatchEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60000),
    matchId: 'man-city-vs-arsenal',
    team: 'Arsenal',
    type: 'goal',
    player: 'Bukayo Saka',
    minute: 34,
    description: 'GOAL! Bukayo Saka scores! Arsenal 1-0',
    icon: '⚽',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60000),
    matchId: 'man-city-vs-arsenal',
    team: 'Manchester City',
    type: 'substitution',
    player: 'Kalvin Phillips',
    minute: 31,
    description: 'Substitution: Kalvin Phillips replaces John Stones',
    icon: '🔄',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 8 * 60000),
    matchId: 'man-city-vs-arsenal',
    team: 'Manchester City',
    type: 'yellow',
    player: 'Kyle Walker',
    minute: 28,
    description: 'Yellow card: Kyle Walker',
    icon: '🟨',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 12 * 60000),
    matchId: 'man-city-vs-arsenal',
    team: 'Arsenal',
    type: 'goal',
    player: 'Gabriel Martinelli',
    minute: 23,
    description: 'GOAL! Gabriel Martinelli scores! Arsenal 1-0',
    icon: '⚽',
  },
]

function EventIcon({ type }: { type: MatchEvent['type'] }) {
  const icons = {
    goal: '⚽',
    substitution: '🔄',
    yellow: '🟨',
    red: '🟥',
    start: '▶️',
    end: '⏹️',
  }
  return <span className="text-lg">{icons[type]}</span>
}

function getEventColor(type: MatchEvent['type']) {
  switch (type) {
    case 'goal':
      return 'text-green-400 border-l-green-400'
    case 'yellow':
      return 'text-yellow-400 border-l-yellow-400'
    case 'red':
      return 'text-red-400 border-l-red-400'
    case 'substitution':
      return 'text-blue-400 border-l-blue-400'
    default:
      return 'text-gray-400 border-l-gray-400'
  }
}

export function LiveFeed() {
  const [events, setEvents] = useState<MatchEvent[]>(mockEvents)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    // Simulate new events
    const interval = setInterval(() => {
      const newEvent: MatchEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        matchId: 'man-city-vs-arsenal',
        team: Math.random() > 0.5 ? 'Arsenal' : 'Manchester City',
        type: 'yellow' as const,
        player: 'Player Name',
        minute: Math.floor(Math.random() * 45) + 1,
        description: 'New event occurred',
        icon: '🟨',
      }
      setEvents((prev) => [newEvent, ...prev].slice(0, 10))
    }, 30000) // Add event every 30 seconds

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="text-primary" size={24} />
          <div>
            <h3 className="text-xl font-bold">Live Match Events</h3>
            <p className="text-sm text-gray-400">Man City vs Arsenal • 38'</p>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isLive
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {isLive ? '🔴 LIVE' : 'OFFLINE'}
        </button>
      </div>

      {/* Events Timeline */}
      <div className="space-y-1">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className={`flex gap-4 p-3 rounded-lg border-l-4 transition-all ${
              getEventColor(event.type)
            } hover:bg-gray-800/50`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Time */}
            <div className="flex flex-col items-center justify-start gap-1">
              <EventIcon type={event.type} />
              <span className="text-xs text-gray-400 font-mono">{event.minute}′</span>
            </div>

            {/* Event Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{event.description}</p>
                <span className="text-xs text-gray-500">
                  {Math.round((Date.now() - event.timestamp.getTime()) / 60000)}m ago
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{event.player}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No More Events */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-300">Match continues</p>
          <p className="text-xs text-blue-200">Follow for live updates as they happen</p>
        </div>
      </div>
    </motion.div>
  )
}
