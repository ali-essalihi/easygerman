export const tagGenerators = {
  levelSummary: (levelId: string) => `${levelId}-summary`,
  topicsList: (levelId: string) => `${levelId}-topics-list`,
  videosList: (topicId: string) => `${topicId}-videos-list`,
  topicDetail: (topicId: string) => `${topicId}-detail`,
  videoDetail: (ytVideoId: string) => `${ytVideoId}-detail`,
}

export const REVALIDATION_TAG_PARAM = 'tag'
export const REVALIDATION_SECRET_HEADER = 'X-Revalidation-Secret'
