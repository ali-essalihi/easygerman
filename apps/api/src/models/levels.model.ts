import pool from '../pool'
import type { LevelEnum } from '../types/db'

interface GetSummaryRow {
  total_topics: number
  total_videos: number
  total_seconds: number
}

export async function getSummary(levelId: LevelEnum) {
  const q = `
    SELECT
      COUNT(DISTINCT t.id)::INTEGER AS total_topics,
      COUNT(v.id)::INTEGER AS total_videos,
      COALESCE(SUM(v.duration_seconds), 0)::INTEGER AS total_seconds
    FROM topics t
    LEFT JOIN videos v ON v.topic_id = t.id
    WHERE t.level_id = $1
  `
  const { rows } = await pool.query(q, [levelId])
  return rows[0] as GetSummaryRow
}
