import { z } from 'zod'
import * as schemas from './schemas'

export type UserRole = 'learner' | 'admin'

export interface GetGoogleAuthUrlRes {
  url: string
}

export interface GetCurrentUserRes {
  email: string
  role: UserRole
}

export type CreateTopicReq = z.infer<typeof schemas.createTopicSchema>
export type UpdateTopicTitleReq = z.infer<typeof schemas.updateTopicTitleSchema>

export type CreateVideoReq = z.infer<typeof schemas.createVideoSchema>
export type ChangeVideoOrderReq = z.infer<typeof schemas.changeVideoOrderSchema>

export interface ToggleCompleteVideoRes {
  completed: boolean
}

export interface GetLevelProgressRes {
  totalCompletedTopics: number
  totalCompletedVideos: number
}

export type GetTopicsProgressRes = Record<string, number>

export interface GetVideosProgressRes {
  completedVideos: string[]
}

export interface GetLevelSummaryRes {
  totalTopics: number
  totalVideos: number
  totalSeconds: number
}

export interface GetAllTopicsRes {
  topics: {
    id: string
    title: string
    totalVideos: number
    totalSeconds: number
  }[]
}

export interface GetAllVideosRes {
  videos: {
    ytVideoId: string
    title: string
    durationSeconds: number
  }[]
}

export type LevelId = z.infer<typeof schemas.levelIdSchema>

export interface GetTopicDetailRes {
  levelId: LevelId
  id: string
  title: string
}

export interface GetVideoDetailRes {
  levelId: LevelId
  topicId: string
  ytVideoId: string
  title: string
  durationSeconds: number
}
