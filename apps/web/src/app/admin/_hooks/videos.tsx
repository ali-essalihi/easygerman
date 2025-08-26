import type {
  CreateVideoReq,
  ChangeVideoOrderReq,
  LevelId,
  GetAllVideosRes,
} from '@easygerman/shared/types'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import useSWR, { useSWRConfig } from 'swr'
import { z } from 'zod'
import { ytVideoIdSchema } from '@easygerman/shared/schemas'
import { api } from '@/api'
import { HTTPError } from 'ky'

const fetcher = ([topicId, url]: [string, string]) =>
  api
    .get<GetAllVideosRes>(url, { searchParams: { topicId } })
    .json()
    .then((data) => data.videos)

export function useVideosList(topicId: string) {
  const { data: videosList } = useSWR([topicId, 'videos'], fetcher)
  return videosList
}

export function useVideosActions(levelId: LevelId, topicId: string) {
  const { mutate } = useSWRConfig()

  const videosListKey = [topicId, 'videos']
  const topicsListKey = [levelId, 'topics']
  const levelSummaryKey = `levels/${levelId}`
  const topicDetailKey = `topics/${topicId}`

  const create = useCallback(() => {
    let ytVideoId = prompt('EasyGerman Youtube Video ID: ')
    if (ytVideoId === null) return
    const ytVideoIdParsed = ytVideoIdSchema.safeParse(ytVideoId)
    if (ytVideoIdParsed.error) {
      const { formErrors } = z.flattenError(ytVideoIdParsed.error)
      return alert(formErrors[0] || 'Invalid Youtube Video ID')
    }
    ytVideoId = ytVideoIdParsed.data
    const json: CreateVideoReq = { topicId, ytVideoId }
    mutate(videosListKey, () => api.post('videos', { json }), {
      populateCache: false,
    })
      .then(() => {
        mutate(topicDetailKey)
        mutate(topicsListKey)
        mutate(levelSummaryKey)
      })
      .catch(async (err) => {
        if (err instanceof HTTPError) {
          const { message } = await err.response.json()
          toast.error(message)
        } else throw err
      })
      .catch(() => toast.error('Failed to create video'))
  }, [])

  const remove = useCallback((ytVideoId: string) => {
    if (!confirm('Delete this video?')) return
    mutate(videosListKey, () => api.delete(`videos/${ytVideoId}`), {
      populateCache: false,
    })
      .then(() => {
        mutate(topicDetailKey)
        mutate(topicsListKey)
        mutate(levelSummaryKey)
      })
      .catch(() => toast.error('Failed to delete video'))
  }, [])

  const changeOder = useCallback(
    (ytVideoId: string, json: ChangeVideoOrderReq, newVideos: GetAllVideosRes['videos']) => {
      mutate(videosListKey, () => api.patch(`videos/${ytVideoId}/change-order`, { json }), {
        optimisticData: newVideos,
        populateCache: false,
        revalidate: false,
      }).catch(() => toast.error('Failed to change video order'))
    },
    []
  )

  return { create, remove, changeOder }
}
