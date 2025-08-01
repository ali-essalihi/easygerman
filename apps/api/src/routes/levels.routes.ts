import express from 'express'
import AppError from '../AppError'
import { CEFR_LEVELS } from '../constants'
import topicsRouter from './topics.routes'

const router = express.Router()

router.param('levelId', (req, res, next, level) => {
  if (!CEFR_LEVELS.includes(level)) {
    throw new AppError(404, 'Level not found')
  }
  next()
})

router.use('/:levelId/topics', topicsRouter)

export default router
