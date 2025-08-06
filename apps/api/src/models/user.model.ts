import type { UserRow } from '../types/db'
import pool from '../pool'

export function createIfNotExists(googleId: string) {
  return pool.query('INSERT INTO users(google_id) VALUES ($1) ON CONFLICT DO NOTHING', [googleId])
}

export async function find(googleId: string) {
  const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId])
  return result.rows[0] as UserRow | undefined
}
