import pkg from 'pg';
import { logger } from '../lib/logger.js';

const { Pool } = pkg;

let pool: pkg.Pool | null = null;

export async function initDatabase() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err: Error) => logger.error('Database Error', err));

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    logger.info('✅ Database connected successfully');
  } catch (err) {
    logger.warn('⚠️  Database connection failed (running in mock mode):', err);
    // Continue without database - app will use mock data
  }

  return pool;
}

export function getPool() {
  // Return null if pool not initialized to allow graceful degradation
  return pool || null;
}

export async function query(text: string, params?: unknown[]) {
  if (!pool) {
    logger.warn('Query attempted without database connection');
    return null;
  }
  return pool.query(text, params);
}
