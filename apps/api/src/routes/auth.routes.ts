import express from 'express'
import * as authController from '../controllers/auth.controller'
import { ensureAuthenticated } from '../middlewares/auth.middlewares'

const router = express.Router()

router.get('/google/url', authController.getGoogleAuthUrl)
router.get('/google/callback', authController.handleGoogleCallback)
router.get('/me', ensureAuthenticated(), authController.getCurrentUser)

export default router
