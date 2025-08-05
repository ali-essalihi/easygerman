export interface YoutubeVideo {
  snippet: {
    title: string
    channelId: string
    liveBroadcastContent: string
  }
  status: {
    embeddable: boolean
    privacyStatus: string
    uploadStatus: string
  }
  contentDetails: {
    duration: string
  }
}
