import express from 'express'
import * as authController from '../controllers/auth.controller'

const router = express.Router()

router.get('/google/url', authController.getGoogleAuthUrl)
router.get('/google/callback', authController.handleGoogleCallback)
router.get('/me', authController.getCurrentUser)

export default router
