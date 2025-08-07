import type { Request, Response, NextFunction } from 'express'
import express from 'express'
import * as videosController from '../controllers/videos.controller'
import * as videosModel from '../models/videos.model'
import * as topicsModel from '../models/topics.model'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'
import {
  createVideoSchema,
  changeVideoOrderSchema,
  ytVideoIdSchema,
  topicIdSchema,
} from '@easygerman/shared/schemas'
import validateReqSchema from '../middlewares/validate-req-schema'
import AppError from '../AppError'

const router = express.Router()

router.param('videoId', async (req, res, next, value) => {
  if (!ytVideoIdSchema.safeParse(value).success) {
    throw new AppError(404, 'Video not found')
  }
  const video = await videosModel.find(value)
  if (!video) {
    throw new AppError(404, 'Video not found')
  }
  req.topic = (await topicsModel.find(video.topic_id))!
  req.video = video
  next()
})

function loadTopicFromQuery() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const topicIdParsed = topicIdSchema.safeParse(req.query.topicId)
    if (!topicIdParsed.success) {
      throw new AppError(400, 'Invalid topicId')
    }
    const topic = await topicsModel.find(topicIdParsed.data)
    if (!topic) {
      throw new AppError(404, 'Topic not found')
    }
    req.topic = topic
    next()
  }
}

router.get(
  '/progress',
  ensureAuthenticated(),
  loadTopicFromQuery(),
  videosController.getVideosProgress
)

router.get('/', loadTopicFromQuery(), videosController.getAllVideos)

router.post(
  '/',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(createVideoSchema),
  videosController.createVideo
)

router.patch(
  '/:videoId/change-order',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(changeVideoOrderSchema),
  videosController.changeVideoOrder
)

router.delete('/:videoId', ensureAuthenticated(), ensureAdmin(), videosController.deleteVideo)

router.patch('/:videoId/toggle-complete', ensureAuthenticated(), videosController.toggleComplete)

export default router
