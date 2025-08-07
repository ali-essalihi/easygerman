import pool from '../pool'
import { VideoRow } from '../types/db'

export async function find(ytVideoId: string) {
  const result = await pool.query('SELECT * FROM videos WHERE yt_video_id = $1', [ytVideoId])
  return result.rows[0] as VideoRow | undefined
}

type CreatePayload = Pick<
  VideoRow,
  'topic_id' | 'yt_video_id' | 'title' | 'duration_seconds' | 'rank'
>

export function create(payload: CreatePayload) {
  const q = `
    INSERT INTO videos(topic_id, yt_video_id, title, duration_seconds, rank)
    VALUES ($1, $2, $3, $4, $5)
  `
  return pool.query(q, [
    payload.topic_id,
    payload.yt_video_id,
    payload.title,
    payload.duration_seconds,
    payload.rank,
  ])
}

export async function getMaxRank(topicId: string) {
  const { rows } = await pool.query('SELECT max(rank) FROM videos WHERE topic_id = $1', [topicId])
  return rows[0].max as string | null
}

export function updateRank(ytVideoId: string, newRank: string) {
  return pool.query('UPDATE videos SET rank = $1 WHERE yt_video_id = $2', [newRank, ytVideoId])
}

export function remove(ytVideoId: string) {
  return pool.query('DELETE FROM videos WHERE yt_video_id = $1', [ytVideoId])
}

export async function getAll(topicId: string) {
  const { rows } = await pool.query('SELECT * FROM videos WHERE topic_id = $1 ORDER BY rank', [
    topicId,
  ])
  return rows as VideoRow[]
}
