import type { LevelId } from '@easygerman/shared/types'
import { EventEmitter } from 'events'

interface EventPayloads {
  // Topics
  'topic.created': { levelId: LevelId }
  'topic.title.updated': { levelId: LevelId; topicId: string }
  'topic.deleted': { levelId: LevelId; topicId: string }

  // Videos
  'video.created': { levelId: LevelId; topicId: string }
  'video.rank.updated': { topicId: string }
  'video.deleted': { levelId: LevelId; topicId: string; ytVideoId: string }
}

type EventName = keyof EventPayloads

type EventListener<P> = (payload: P) => void

class AppEventEmitter extends EventEmitter {
  on<E extends EventName>(ev: E, listener: EventListener<EventPayloads[E]>) {
    return super.on(ev, listener)
  }

  emit<E extends EventName>(ev: E, payload: EventPayloads[E]) {
    return super.emit(ev, payload)
  }
}

export default new AppEventEmitter()
