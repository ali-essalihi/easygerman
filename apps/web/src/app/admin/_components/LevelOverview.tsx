'use client'

import type { GetLevelSummaryRes, LevelId } from '@easygerman/shared/types'
import { api } from '@/api'
import useSWR from 'swr'
import { TopicIcon, levels, VideoLibIcon } from '@/constants'
import LabeledIcon from '@/components/LabeledIcon'

interface Props {
  levelId: LevelId
}

const fetcher = (url: string) => api.get<GetLevelSummaryRes>(url).json()

export default function LevelOverview({ levelId }: Props) {
  const levelInfo = levels.find((l) => l.level === levelId)!
  const { data: summary } = useSWR(`levels/${levelId}`, fetcher)

  return (
    <div className="mb-4">
      <h1 className="text-3xl text-gray-800 font-bold">
        {levelInfo.level} - {levelInfo.label}
      </h1>
      {summary && (
        <div className="flex items-center space-x-2 mt-2">
          <LabeledIcon Icon={TopicIcon} label={summary.totalTopics.toString()} />
          <LabeledIcon Icon={VideoLibIcon} label={summary.totalVideos.toString()} />
        </div>
      )}
    </div>
  )
}
