import type {
  ToggleCompleteVideoRes,
  GetVideosProgressRes,
  LevelId,
} from '@easygerman/shared/types'
import type { MutatorCallback, MutatorOptions } from 'swr'
import { useCurrentUser } from './useUser'
import { api } from '@/api'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

const fetcher = ([topicId, url]: [string, string]) =>
  api
    .get<GetVideosProgressRes>(url, { searchParams: { topicId } })
    .json()
    .then((data) => data.completedVideos)

export default function useVideosProgress(levelId: LevelId, topicId: string) {
  const user = useCurrentUser()
  const { data: completedVideos, mutate } = useSWR(
    user ? [topicId, 'videos/progress'] : null,
    fetcher,
    { revalidateIfStale: false }
  )
  const { mutate: globalMutate } = useSWRConfig()

  const isVideoCompleted = useCallback(
    (ytVideoId: string) => {
      if (!completedVideos) {
        return null
      }
      return completedVideos.includes(ytVideoId)
    },
    [completedVideos]
  )

  const toggleVideoCompleted = useCallback(
    (ytVideoId: string) => {
      if (!completedVideos) {
        return
      }

      type Data = typeof completedVideos

      const mutator: MutatorCallback<Data> = async (currData) => {
        const { completed } = await api
          .patch<ToggleCompleteVideoRes>(`videos/${ytVideoId}/toggle-complete`)
          .json()
        const nextData = new Set(currData)
        if (completed) nextData.add(ytVideoId)
        else nextData.delete(ytVideoId)
        return Array.from(nextData)
      }

      const optimisticData: MutatorOptions<Data>['optimisticData'] = (currData) => {
        const nextData = new Set(currData)
        if (nextData.has(ytVideoId)) nextData.delete(ytVideoId)
        else nextData.add(ytVideoId)
        return Array.from(nextData)
      }

      mutate(mutator, {
        optimisticData,
        revalidate: false,
      })
        .then(() => {
          globalMutate(`levels/${levelId}/progress`)
          globalMutate([levelId, 'topics/progress'])
        })
        .catch(() => toast.error('Failed to toggle video completion.'))
    },
    [completedVideos]
  )

  return {
    isVideoCompleted,
    toggleVideoCompleted,
  }
}
