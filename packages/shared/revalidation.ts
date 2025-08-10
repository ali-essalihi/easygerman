export const tagGenerators = {
  levelSummary: (levelId: string) => `${levelId}-summary`,
  topicsList: (levelId: string) => `${levelId}-topics-list`,
  videosList: (topicId: string) => `${topicId}-videos-list`,
  topicDetail: (topicId: string) => `${topicId}-detail`,
  videoDetail: (ytVideoId: string) => `${ytVideoId}-detail`,
}
