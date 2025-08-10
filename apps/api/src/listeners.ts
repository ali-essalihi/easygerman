import events from './events'
import { revalidateTags } from './services/next-revalidation'
import { tagGenerators } from '@easygerman/shared/revalidation'

// Topics
events.on('topic.created', ({ levelId }) => {
  revalidateTags([tagGenerators.topicsList(levelId), tagGenerators.levelSummary(levelId)])
})

events.on('topic.title.updated', ({ levelId, topicId }) => {
  revalidateTags([tagGenerators.topicDetail(topicId), tagGenerators.topicsList(levelId)])
})

events.on('topic.deleted', ({ levelId, topicId }) => {
  revalidateTags([
    tagGenerators.topicDetail(topicId),
    tagGenerators.topicsList(levelId),
    tagGenerators.levelSummary(levelId),
  ])
})

// Videos
events.on('video.created', ({ levelId, topicId }) => {
  revalidateTags([
    tagGenerators.videosList(topicId),
    tagGenerators.topicsList(levelId),
    tagGenerators.levelSummary(levelId),
  ])
})

events.on('video.rank.updated', ({ topicId }) => {
  revalidateTags([tagGenerators.videosList(topicId)])
})

events.on('video.deleted', ({ levelId, topicId, ytVideoId }) => {
  revalidateTags([
    tagGenerators.videoDetail(ytVideoId),
    tagGenerators.videosList(topicId),
    tagGenerators.topicsList(levelId),
    tagGenerators.levelSummary(levelId),
  ])
})
