import type { GetLevelSummaryRes, LevelId } from '@easygerman/shared/types'
import { ClockIcon, levels, TopicIcon, VideoLibIcon } from '@/constants'
import LabeledIcon from './LabeledIcon'
import { formatTotalDuration } from '@/utils/format'

interface Props {
  levelId: LevelId
  summary: GetLevelSummaryRes
}

export default function LevelOverview({ levelId, summary }: Props) {
  const levelInfo = levels.find((l) => l.level === levelId)!
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        className="w-32 h-32 shrink-0 text-4xl font-bold text-white rounded-full flex items-center justify-center"
        style={{ backgroundColor: levelInfo.color }}
      >
        {levelInfo.level}
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-medium">
          {levelInfo.level} - {levelInfo.label}
        </h1>
        <LabeledIcon Icon={TopicIcon} label={`${summary.totalTopics} Total topics`} />
        <LabeledIcon Icon={VideoLibIcon} label={`${summary.totalVideos} Total videos`} />
        <LabeledIcon
          Icon={ClockIcon}
          label={`${formatTotalDuration(summary.totalSeconds)} Total hours`}
        />
      </div>
    </div>
  )
}
