import type { LevelEnum, TopicRow } from '../types/db'
import pool from '../pool'

export async function find(id: string) {
  const result = await pool.query('SELECT * FROM topics WHERE id = $1', [id])
  return result.rows[0] as TopicRow | undefined
}

export function create(payload: Pick<TopicRow, 'level_id' | 'title'>) {
  return pool.query('INSERT INTO topics(level_id, title) VALUES ($1, $2)', [
    payload.level_id,
    payload.title,
  ])
}

export function updateTitle(id: string, newTitle: string) {
  return pool.query('UPDATE topics SET title = $1 WHERE id = $2', [newTitle, id])
}

export function remove(id: string) {
  return pool.query('DELETE FROM topics WHERE id = $1', [id])
}

export async function getAll(levelId: LevelEnum) {
  const { rows } = await pool.query('SELECT * FROM topics WHERE level_id = $1 ORDER BY title', [
    levelId,
  ])
  return rows as TopicRow[]
}
