import type { CreateTopicReq, UpdateTopicTitleReq } from '@easygerman/shared/types'
import type { Request, Response } from 'express'
import * as topicsModel from '../models/topics.model'

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
