import type { UserCompletedVideoRow } from '../types/db'
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
