import type { Request, Response } from 'express'
import type { GetLevelProgressRes, GetLevelSummaryRes } from '@easygerman/shared/types'
import * as levelsModel from '../models/levels.model'
import * as userModel from '../models/user.model'

export async function getLevelProgress(req: Request, res: Response<GetLevelProgressRes>) {
  const dbUser = (await userModel.find(req.user.googleId))!
  const { total_completed_topics, total_completed_videos } = await levelsModel.getUserProgress(
    dbUser.id,
    req.level.id
  )
  res.json({
    totalCompletedTopics: total_completed_topics,
    totalCompletedVideos: total_completed_videos,
  })
}

export async function getLevelSummary(req: Request, res: Response<GetLevelSummaryRes>) {
  const summary = await levelsModel.getSummary(req.level.id)
  res.json({
    totalTopics: summary.total_topics,
    totalVideos: summary.total_videos,
    totalSeconds: summary.total_seconds,
  })
}
