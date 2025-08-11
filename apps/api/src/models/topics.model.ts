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
  const q = `
    SELECT 
      t.*,
      COALESCE(total_videos, 0)::INTEGER AS total_videos,
      COALESCE(stats.total_seconds, 0)::INTEGER AS total_seconds
    FROM topics t
    LEFT JOIN (
      SELECT v.topic_id, COUNT(v.id) AS total_videos, SUM(v.duration_seconds) AS total_seconds
      FROM videos v
      GROUP BY v.topic_id
    ) stats ON stats.topic_id = t.id
    WHERE t.level_id = $1
  `
  const { rows } = await pool.query(q, [levelId])
  return rows as (TopicRow & { total_videos: number; total_seconds: number })[]
}

interface GetCompletedCountRow {
  topic_id: string
  total_completed_videos: number
}

export async function getUserCompletedVideosCount(userId: number, levelId: LevelEnum) {
  const q = `
    SELECT t.id as topic_id, count(ucv.video_id)::INTEGER as total_completed_videos FROM topics t
    LEFT JOIN videos v ON v.topic_id = t.id
    LEFT JOIN user_completed_videos ucv ON ucv.user_id = $1 AND ucv.video_id = v.id
    WHERE t.level_id = $2
    GROUP BY t.id
  `
  const { rows } = await pool.query(q, [userId, levelId])
  return rows as GetCompletedCountRow[]
}
