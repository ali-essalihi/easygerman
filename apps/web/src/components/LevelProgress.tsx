'use client'

import type { GetLevelProgressRes, GetLevelSummaryRes, LevelId } from '@easygerman/shared/types'
import useSWR from 'swr'
import { useCurrentUser } from '@/hooks/useUser'
import { api } from '@/api'
import ProgressBar from './ProgressBar'

interface Props {
  levelId: LevelId
  summary: GetLevelSummaryRes
}

const fetcher = (url: string) => api.get<GetLevelProgressRes>(url).json()

export default function LevelProgress({ levelId, summary }: Props) {
  const user = useCurrentUser()
  const { data: progress } = useSWR(user ? `levels/${levelId}/progress` : null, fetcher, {
    revalidateIfStale: true,
  })

  if (!progress) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
      <ProgressBar
        label={`${progress.totalCompletedTopics} / ${summary.totalTopics} Topics Completed`}
        value={progress.totalCompletedTopics}
        max={summary.totalTopics}
      />
      <ProgressBar
        label={`${progress.totalCompletedVideos} / ${summary.totalVideos} Videos Completed`}
        value={progress.totalCompletedVideos}
        max={summary.totalVideos}
      />
    </div>
  )
}
