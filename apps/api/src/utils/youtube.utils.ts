import type { YoutubeVideo } from '../types/youtube.types'
import fetch from 'node-fetch'
import env from '../env'

export async function getYoutubeVideo(ytVideoId: string) {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  const params = new URLSearchParams({
    key: env.YOUTUBE_API_KEY,
    id: ytVideoId,
    part: 'snippet,status,contentDetails',
    fields:
      'items(snippet(title,channelId,liveBroadcastContent),status(embeddable,privacyStatus,uploadStatus),contentDetails(duration))',
  })
  url.search = params.toString()
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      `Failed to fetch video from YouTube API. Status: ${res.status} ${res.statusText}`
    )
  }
  const data = (await res.json()) as { items: YoutubeVideo[] }
  if (data.items.length === 0) {
    return null
  }
  return data.items[0]
}
