'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

interface MatchCardProps {
  matchId: string;
  homeTeam: { name: string; logo: string; xg: number };
  awayTeam: { name: string; logo: string; xg: number };
  kickoff: string;
  competition: string;
  prediction: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  confidence: 'very-high' | 'high' | 'medium' | 'low';
  isLive?: boolean;
  score?: { home: number; away: number };
}

export default function MatchCard({
  matchId,
  homeTeam,
  awayTeam,
  kickoff,
  competition,
  prediction,
  confidence,
  isLive,
  score,
}: MatchCardProps) {
  const confidenceColors = {
    'very-high': 'from-emerald-500 to-cyan-500',
    high: 'from-blue-500 to-cyan-500',
    medium: 'from-amber-500 to-orange-500',
    low: 'from-orange-500 to-red-500',
  };

  const confidenceLabels = {
    'very-high': 'Very High',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const topPrediction = Math.max(prediction.homeWin, prediction.draw, prediction.awayWin);
  const topPredictionKey =
    topPrediction === prediction.homeWin ? 'Home' : topPrediction === prediction.draw ? 'Draw' : 'Away';

  return (
    <Link href={`/match/${matchId}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative h-full cursor-pointer rounded-xl border border-purple-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 sm:p-6"
      >
        {/* Live Badge */}
        {isLive && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white sm:right-4 sm:top-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            LIVE
          </div>
        )}

        {/* Competition & Confidence */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-400">{competition}</span>
          <div className={`rounded-full bg-gradient-to-r ${confidenceColors[confidence]} p-0.5`}>
            <div className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
              {confidenceLabels[confidence]}
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <img src={homeTeam.logo} alt={homeTeam.name} className="h-10 w-10 sm:h-12 sm:w-12" />
            <p className="text-center text-xs font-bold text-white sm:text-sm">{homeTeam.name}</p>
            <p className="text-xs text-cyan-400">xG: {homeTeam.xg.toFixed(1)}</p>
          </div>

          {/* Score or Time */}
          <div className="flex flex-col items-center gap-2">
            {score ? (
              <>
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  {score.home} - {score.away}
                </div>
                <span className="text-xs text-purple-300">FT</span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-purple-300">{kickoff}</span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <img src={awayTeam.logo} alt={awayTeam.name} className="h-10 w-10 sm:h-12 sm:w-12" />
            <p className="text-center text-xs font-bold text-white sm:text-sm">{awayTeam.name}</p>
            <p className="text-xs text-cyan-400">xG: {awayTeam.xg.toFixed(1)}</p>
          </div>
        </div>

        {/* Prediction Probabilities */}
        <div className="space-y-2 border-t border-purple-500/20 pt-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-300">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              {homeTeam.name} Win
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-slate-700 sm:w-32">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${prediction.homeWin}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </div>
              <span className="w-8 font-bold text-cyan-400">{Math.round(prediction.homeWin)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-300">Draw</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-slate-700 sm:w-32">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${prediction.draw}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
              <span className="w-8 font-bold text-pink-400">{Math.round(prediction.draw)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-300">{awayTeam.name} Win</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-slate-700 sm:w-32">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${prediction.awayWin}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
              <span className="w-8 font-bold text-emerald-400">{Math.round(prediction.awayWin)}%</span>
            </div>
          </div>
        </div>

        {/* Top Prediction Badge */}
        <div className="mt-4 rounded-lg bg-slate-700/50 p-2 text-center text-xs font-semibold text-white">
          <Zap className="mr-1 inline h-3 w-3 text-yellow-400" />
          Top Pick: {topPredictionKey} Win ({Math.round(topPrediction)}%)
        </div>
      </motion.div>
    </Link>
  );
}
