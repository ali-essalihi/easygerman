import type { LevelEnum, UserCompletedVideoRow } from '../types/db'
import pool from '../pool'

export function createIfNotExists(payload: Pick<UserCompletedVideoRow, 'user_id' | 'video_id'>) {
  const q = `
    INSERT INTO user_completed_videos(user_id, video_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `
  return pool.query(q, [payload.user_id, payload.video_id])
}

export function remove(payload: Pick<UserCompletedVideoRow, 'user_id' | 'video_id'>) {
  return pool.query('DELETE FROM user_completed_videos WHERE user_id = $1 AND video_id = $2', [
    payload.user_id,
    payload.video_id,
  ])
}

interface CalcLevelProgressRow {
  total_completed_topics: number
  total_completed_videos: number
}

export async function calcLevelProgress(userId: number, levelId: LevelEnum) {
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
  return rows[0] as CalcLevelProgressRow
}

interface CalcTopicsProgressRow {
  topic_id: string
  total_completed_videos: number
}

export async function calcTopicsProgress(userId: number, levelId: LevelEnum) {
  const q = `
    SELECT t.id as topic_id, count(ucv.video_id)::INTEGER as total_completed_videos FROM topics t
    LEFT JOIN videos v ON v.topic_id = t.id
    LEFT JOIN user_completed_videos ucv ON ucv.user_id = $1 AND ucv.video_id = v.id
    WHERE t.level_id = $2
    GROUP BY t.id
  `
  const { rows } = await pool.query(q, [userId, levelId])
  return rows as CalcTopicsProgressRow[]
}

export async function calcVideosProgress(userId: number, topicId: string) {
  const q = `
    SELECT v.yt_video_id FROM videos v
    JOIN user_completed_videos ucv ON ucv.user_id = $1 AND ucv.video_id = v.id
    WHERE v.topic_id = $2;
  `
  const { rows } = await pool.query(q, [userId, topicId])
  return rows as { yt_video_id: string }[]
}
