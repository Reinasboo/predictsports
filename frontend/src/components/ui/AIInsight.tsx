import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AIInsightProps {
  insight: string
  loading?: boolean
  error?: boolean
}

export default function AIInsight({ insight, loading = false, error = false }: AIInsightProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (insight) {
      setIsVisible(true)
    }
  }, [insight])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <motion.div
          animate={{ rotateY: loading ? 360 : 0 }}
          transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
          className="flex-shrink-0 pt-0.5"
        >
          <Brain size={20} className="text-blue-500" />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            AI Insight
          </h4>

          {loading ? (
            <div className="space-y-1.5">
              <div className="h-2 bg-blue-500/20 rounded w-3/4 animate-pulse" />
              <div className="h-2 bg-blue-500/20 rounded w-full animate-pulse" />
              <div className="h-2 bg-blue-500/20 rounded w-4/5 animate-pulse" />
            </div>
          ) : error ? (
            <p className="text-xs text-neutral-400">Unable to load AI insight at this time.</p>
          ) : (
            <p className="text-xs leading-relaxed text-neutral-300">{insight}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
