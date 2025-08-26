import type {
  CreateTopicReq,
  GetAllTopicsRes,
  UpdateTopicTitleReq,
  LevelId,
} from '@easygerman/shared/types'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import useSWR, { useSWRConfig } from 'swr'
import { z } from 'zod'
import { topicTitleSchema } from '@easygerman/shared/schemas'
import { api } from '@/api'

const fetcher = ([levelId, url]: [LevelId, string]) =>
  api
    .get<GetAllTopicsRes>(url, { searchParams: { levelId } })
    .json()
    .then((data) => data.topics)

export function useTopicsList(levelId: LevelId) {
  const { data: topicsList } = useSWR([levelId, 'topics'], fetcher)
  return topicsList
}

function readTopicTitle(promptMessage: string) {
  const title = prompt(promptMessage)
  if (title == null) return
  const titleParsed = topicTitleSchema.safeParse(title)
  if (titleParsed.error) {
    const { formErrors } = z.flattenError(titleParsed.error)
    alert(formErrors[0] || 'Invalid topic title')
    return null
  }
  return titleParsed.data
}

export function useTopicsActions(levelId: LevelId) {
  const { mutate } = useSWRConfig()

  const topicsListKey = [levelId, 'topics']
  const levelSummaryKey = `levels/${levelId}`

  const create = useCallback(() => {
    const title = readTopicTitle('Topic title: ')
    if (!title) return
    const json: CreateTopicReq = { levelId, title }
    mutate(topicsListKey, () => api.post('topics', { json }), {
      populateCache: false,
    })
      .then(() => mutate(levelSummaryKey))
      .catch(() => toast.error('Failed to create topic'))
  }, [])

  const remove = useCallback((topicId: string) => {
    if (!confirm('Delete this topic?')) return
    mutate(topicsListKey, () => api.delete(`topics/${topicId}`), {
      populateCache: false,
    })
      .then(() => {
        mutate(levelSummaryKey)
        mutate(`topics/${topicId}`)
      })
      .catch(() => toast.error('Failed to delete topic'))
  }, [])

  const updateTitle = useCallback((topicId: string) => {
    const newTitle = readTopicTitle('New Topic title: ')
    if (!newTitle) return
    const json: UpdateTopicTitleReq = { newTitle }
    mutate(topicsListKey, () => api.patch(`topics/${topicId}`, { json }), {
      populateCache: false,
    })
      .then(() => mutate(`topics/${topicId}`))
      .catch(() => toast.error('Failed to update topic title'))
  }, [])

  return { create, remove, updateTitle }
}
