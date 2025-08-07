import express from 'express'
import * as videosController from '../controllers/videos.controller'
import * as videosModel from '../models/videos.model'
import * as topicsModel from '../models/topics.model'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'
import {
  createVideoSchema,
  changeVideoOrderSchema,
  ytVideoIdSchema,
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

router.get('/progress', ensureAuthenticated(), videosController.getVideosProgress)

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
