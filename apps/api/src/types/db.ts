import type { UserRole, LevelId } from '@easygerman/shared/types'

export type LevelEnum = LevelId
export type RoleEnum = UserRole

export interface LevelRow {
  id: LevelEnum
}

export interface TopicRow {
  id: string
  level_id: LevelEnum
  title: string
  created_at: Date
}

export interface VideoRow {
  id: number
  topic_id: string
  yt_video_id: string
  title: string
  duration_seconds: number
  rank: string
  created_at: Date
}

export interface UserRow {
  id: number
  google_id: string
  role: RoleEnum
  created_at: Date
}

export interface UserCompletedVideoRow {
  user_id: number
  video_id: number
  created_at: Date
}
