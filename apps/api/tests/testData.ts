import type { Request } from 'express'
import type { YoutubeVideo } from '../src/types/youtube.types'
import { EASY_GERMAN_CHANNEL_ID } from '../src/constants'

export const ytBaseVideo: YoutubeVideo = {
  snippet: {
    channelId: EASY_GERMAN_CHANNEL_ID,
    liveBroadcastContent: 'none',
    title: 'test',
  },
  status: {
    privacyStatus: 'public',
    uploadStatus: 'processed',
    embeddable: true,
  },
  contentDetails: { duration: 'PT2M' },
}

export const mockUser: Request['user'] = {
  googleId: '123',
  email: 'test@example.com',
  role: 'learner',
}
