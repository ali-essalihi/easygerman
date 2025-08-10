import type { Request, Response, NextFunction } from 'express'
import * as topicsModel from '../models/topics.model'
import * as videosModel from '../models/videos.model'
import { levelIdSchema, topicIdSchema, ytVideoIdSchema } from '@easygerman/shared/schemas'
import AppError from '../AppError'

export function loadTopic(source: 'query' | 'params') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const topicIdParsed = topicIdSchema.safeParse(
      source === 'params' ? req.params.topicId : req.query.topicId
    )
    if (!topicIdParsed.success) {
      throw new AppError(404, 'Topic not found')
    }
    const topic = await topicsModel.find(topicIdParsed.data)
    if (!topic) {
      throw new AppError(404, 'Topic not found')
    }
    req.topic = topic
    next()
  }
}

export function loadVideoFromParams(includeTopic = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ytVideoIdParsed = ytVideoIdSchema.safeParse(req.params.ytVideoId)
    if (!ytVideoIdParsed.success) {
      throw new AppError(404, 'Video not found')
    }
    const video = await videosModel.find(ytVideoIdParsed.data)
    if (!video) {
      throw new AppError(404, 'Video not found')
    }
    req.video = video
    if (includeTopic) {
      req.topic = (await topicsModel.find(video.topic_id))!
    }
    next()
  }
}

export function loadLevel(source: 'query' | 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    const levelIdParsed = levelIdSchema.safeParse(
      source === 'params' ? req.params.levelId : req.query.levelId
    )
    if (!levelIdParsed.success) {
      throw new AppError(404, 'Level not found')
    }
    req.level = {
      id: levelIdParsed.data,
    }
    next()
  }
}
