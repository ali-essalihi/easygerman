import type {
  CreateTopicReq,
  GetAllTopicsRes,
  GetTopicsProgressRes,
  UpdateTopicTitleReq,
} from '@easygerman/shared/types'
import type { Request, Response } from 'express'
import * as topicsModel from '../models/topics.model'
import * as userModel from '../models/user.model'
import { levelIdSchema } from '@easygerman/shared/schemas'
import AppError from '../AppError'

export async function createTopic(req: Request, res: Response) {
  const body = req.body as CreateTopicReq
  await topicsModel.create({
    level_id: body.levelId,
    title: body.title,
  })
  res.status(201).end()
}

export async function updateTopicTitle(req: Request, res: Response) {
  const body = req.body as UpdateTopicTitleReq
  await topicsModel.updateTitle(req.topic.id, body.newTitle)
  res.status(204).end()
}

export async function deleteTopic(req: Request, res: Response) {
  const { topicId } = req.params
  await topicsModel.remove(topicId)
  res.status(204).end()
}

export async function getTopicsProgress(req: Request, res: Response<GetTopicsProgressRes>) {
  const levelIdParsed = levelIdSchema.safeParse(req.query.levelId)

  if (!levelIdParsed.success) {
    throw new AppError(400, 'Invalid levelId')
  }

  const levelId = levelIdParsed.data
  const dbUser = (await userModel.find(req.user.googleId))!
  const progress: GetTopicsProgressRes = {}
  const topics = await topicsModel.getCompletedCount(dbUser.id, levelId)

  for (const topic of topics) {
    progress[topic.topic_id] = topic.total_completed_videos
  }

  res.json(progress)
}

export async function getAllTopics(req: Request, res: Response<GetAllTopicsRes>) {
  const levelIdParsed = levelIdSchema.safeParse(req.query.levelId)
  if (!levelIdParsed.success) {
    throw new AppError(400, 'Invalid levelId')
  }
  const levelId = levelIdParsed.data
  const topics = await topicsModel.getAll(levelId)
  res.json({
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
    })),
  })
}
