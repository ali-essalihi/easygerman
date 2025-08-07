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

interface GetUserProgressRow {
  total_completed_topics: number
  total_completed_videos: number
}

export async function getUserProgress(userId: number, levelId: LevelEnum) {
  const q = `
    SELECT
      COALESCE(sum(CASE WHEN completed = total THEN 1 ELSE 0 END), 0)::INTEGER as total_completed_topics,
      COALESCE(sum(completed), 0)::INTEGER as total_completed_videos
    FROM (
      SELECT t.id, count(ucv.video_id) as completed, count(v.id) as total FROM topics t
      LEFT JOIN videos v ON v.topic_id = t.id
      LEFT JOIN user_completed_videos ucv ON ucv.user_id = $1 AND ucv.video_id = v.id
      WHERE t.level_id = $2
      GROUP BY t.id
    )
  `
  const { rows } = await pool.query(q, [userId, levelId])
  return rows[0] as GetUserProgressRow
}
