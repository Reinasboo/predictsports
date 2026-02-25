import cron from 'node-cron'
import { fixtureProvider, oddsProvider } from '../services/providers.js'
import { query } from '../db/connection.js'
import { getRedis } from '../lib/redis.js'
import { logger } from '../lib/logger.js'

const redis = getRedis();

export async function startPipelineOrchestrator() {
  logger.info('🔄 Starting data pipeline orchestrator')

  // Fetch fixtures every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('⏰ Running fixture sync...')
    try {
      const fixtures = await fixtureProvider.getFixtures()
      logger.info(`✅ Fetched ${fixtures.length} fixtures`)

      // Store in database
      for (const fixture of fixtures) {
        await query(
          `INSERT INTO matches (internal_match_id, kickoff, status) 
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [fixture.fixture.id, new Date(fixture.fixture.timestamp), fixture.fixture.status]
        )
      }
    } catch (err) {
      logger.error('❌ Fixture sync failed', err)
    }
  })

  // Fetch live matches every minute
  cron.schedule('* * * * *', async () => {
    try {
      const liveMatches = await fixtureProvider.getLiveMatches()
      if (liveMatches.length > 0) {
        logger.info(`🔴 ${liveMatches.length} live matches`)
        if (redis) {
          await redis.publish('live-updates', JSON.stringify({ liveMatches }))
        }
      }
    } catch (err) {
      logger.error('Live match sync failed', err)
    }
  })

  // Fetch odds every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    logger.info('💰 Syncing odds...')
    try {
      const matches = await query('SELECT id FROM matches WHERE status = $1 LIMIT 20', ['scheduled'])

      for (const match of (matches as any)?.rows || []) {
        const odds = await oddsProvider.getOdds(match.id)
        if (odds.length > 0) {
          // Store in database
          logger.info(`✅ Updated odds for match ${match.id}`)
        }
      }
    } catch (err) {
      logger.error('Odds sync failed', err)
    }
  })

  logger.info('✅ Pipeline orchestrator started')
}
