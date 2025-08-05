import type { YoutubeVideo } from '../types/youtube.types'
import { EASY_GERMAN_CHANNEL_ID } from '../constants'

export function isValidEasyGermanVideo(ytVideo: YoutubeVideo) {
  return (
    ytVideo.snippet.channelId === EASY_GERMAN_CHANNEL_ID &&
    ytVideo.status.privacyStatus === 'public' &&
    ytVideo.snippet.liveBroadcastContent === 'none' &&
    ytVideo.status.uploadStatus === 'processed' &&
    ytVideo.status.embeddable
  )
}
