import type { LevelEnum } from '../types/db'
import type { Request, Response } from 'express'
import type { GetLevelProgressRes } from '@easygerman/shared/types'
import * as userModel from '../models/user.model'
import * as userCompletedVideosModel from '../models/user-completed-videos.model'

export async function getLevelProgress(req: Request, res: Response<GetLevelProgressRes>) {
  const { levelId } = req.params
  const dbUser = (await userModel.find(req.user.googleId))!
  const { total_completed_topics, total_completed_videos } =
    await userCompletedVideosModel.calcLevelProgress(dbUser.id, levelId as LevelEnum)
  res.json({
    totalCompletedTopics: total_completed_topics,
    totalCompletedVideos: total_completed_videos,
  })
}
