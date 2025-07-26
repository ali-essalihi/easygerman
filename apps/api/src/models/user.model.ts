import pool from '../pool'

export function createIfNotExists(googleId: string) {
  return pool.query('INSERT INTO users(google_id) VALUES ($1) ON CONFLICT DO NOTHING', [googleId])
}
