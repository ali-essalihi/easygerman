'use client'

import type { GetTopicsProgressRes, LevelId } from '@easygerman/shared/types'
import useSWR from 'swr'
import { useCurrentUser } from '@/hooks/useUser'
import { api } from '@/api'
import ProgressBar from './ProgressBar'

interface Props {
  levelId: LevelId
  topicId: string
  totalVideos: number
}

const fetcher = ([levelId, url]: [LevelId, string]) =>
  api.get<GetTopicsProgressRes>(url, { searchParams: { levelId } }).json()

export default function TopicProgress({ levelId, topicId, totalVideos }: Props) {
  const user = useCurrentUser()
  const { data: topicsProgress } = useSWR(user ? [levelId, 'topics/progress'] : null, fetcher)

  if (!topicsProgress) {
    return null
  }

  const completedVideosCount = topicsProgress[topicId]
  const label = `${completedVideosCount} / ${totalVideos} Videos completed`

  return <ProgressBar label={label} value={completedVideosCount} max={totalVideos} />
}
