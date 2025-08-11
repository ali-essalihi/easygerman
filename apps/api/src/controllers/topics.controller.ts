import type {
  CreateTopicReq,
  GetAllTopicsRes,
  GetTopicDetailRes,
  GetTopicsProgressRes,
  UpdateTopicTitleReq,
} from '@easygerman/shared/types'
import type { Request, Response } from 'express'
import * as topicsModel from '../models/topics.model'
import * as userModel from '../models/user.model'
import events from '../events'

export async function createTopic(req: Request, res: Response) {
  const body = req.body as CreateTopicReq
  await topicsModel.create({
    level_id: body.levelId,
    title: body.title,
  })
  events.emit('topic.created', {
    levelId: body.levelId,
  })
  res.status(201).end()
}

export async function updateTopicTitle(req: Request, res: Response) {
  const body = req.body as UpdateTopicTitleReq
  await topicsModel.updateTitle(req.topic.id, body.newTitle)
  events.emit('topic.title.updated', {
    levelId: req.topic.level_id,
    topicId: req.topic.id,
  })
  res.status(204).end()
}

export async function deleteTopic(req: Request, res: Response) {
  await topicsModel.remove(req.topic.id)
  events.emit('topic.deleted', {
    levelId: req.topic.level_id,
    topicId: req.topic.id,
  })
  res.status(204).end()
}

export async function getTopicsProgress(req: Request, res: Response<GetTopicsProgressRes>) {
  const dbUser = (await userModel.find(req.user.googleId))!
  const progress: GetTopicsProgressRes = {}
  const topics = await topicsModel.getUserCompletedVideosCount(dbUser.id, req.level.id)
  for (const topic of topics) {
    progress[topic.topic_id] = topic.total_completed_videos
  }
  res.json(progress)
}

export async function getAllTopics(req: Request, res: Response<GetAllTopicsRes>) {
  const topics = await topicsModel.getAll(req.level.id)
  res.json({
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
      totalVideos: t.total_videos,
      totalSeconds: t.total_seconds,
    })),
  })
}

export async function getTopicDetail(req: Request, res: Response<GetTopicDetailRes>) {
  res.json({
    id: req.topic.id,
    levelId: req.topic.level_id,
    title: req.topic.title,
  })
}
