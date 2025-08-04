export type LevelEnum = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type RoleEnum = 'learner' | 'admin'

export interface LevelRow {
  id: LevelEnum
}

export interface TopicRow {
  id: string
  level_id: LevelEnum
  title: string
}

export interface VideoRow {
  id: number
  topic_id: string
  yt_video_id: string
  title: string
  duration_seconds: number
  rank: string
}

export interface UserRow {
  id: number
  google_id: string
  role: RoleEnum
}

export interface UserCompletedVideoRow {
  user_id: number
  video_id: number
}
