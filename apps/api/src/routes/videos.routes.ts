import express from 'express'
import * as videosController from '../controllers/videos.controller'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'
import { createVideoSchema, changeVideoOrderSchema } from '@easygerman/shared/schemas'
import validateReqSchema from '../middlewares/validate-req-schema'
import { loadTopic, loadVideoFromParams } from '../middlewares/db-loaders'

const router = express.Router()

router.get(
  '/progress',
  ensureAuthenticated(),
  loadTopic('query'),
  videosController.getVideosProgress
)

router.get('/', loadTopic('query'), videosController.getAllVideos)

router.get('/:ytVideoId', loadVideoFromParams(true), videosController.getVideoDetail)

router.post(
  '/',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(createVideoSchema),
  videosController.createVideo
)

router.patch(
  '/:ytVideoId/change-order',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(changeVideoOrderSchema),
  loadVideoFromParams(),
  videosController.changeVideoOrder
)

router.delete(
  '/:ytVideoId',
  ensureAuthenticated(),
  ensureAdmin(),
  loadVideoFromParams(true),
  videosController.deleteVideo
)

router.patch(
  '/:ytVideoId/toggle-complete',
  ensureAuthenticated(),
  loadVideoFromParams(),
  videosController.toggleCompleteVideo
)

export default router
