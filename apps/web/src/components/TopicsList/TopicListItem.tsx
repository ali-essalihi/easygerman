import type { GetAllTopicsRes, LevelId } from '@easygerman/shared/types'
import Link from 'next/link'
import LabeledIcon from '../LabeledIcon'
import { ClockIcon, VideoLibIcon } from '@/constants'
import { formatTotalDuration } from '@/utils/format'
import TopicProgress from '../TopicProgress'

interface Props {
  topic: GetAllTopicsRes['topics'][number]
  levelId: LevelId
}

export default function TopicListItem({ topic, levelId }: Props) {
  return (
    <div className="border rounded shadow-sm p-4">
      <h3 className="font-medium mb-2">
        <Link href={`/topics/${topic.id}`} prefetch={false} className="hover:text-primary">
          {topic.title}
        </Link>
      </h3>
      <div className="flex items-center space-x-2 mb-2">
        <LabeledIcon Icon={VideoLibIcon} label={topic.totalVideos.toString()} />
        <LabeledIcon Icon={ClockIcon} label={formatTotalDuration(topic.totalSeconds)} />
      </div>
      <TopicProgress levelId={levelId} topicId={topic.id} totalVideos={topic.totalVideos} />
    </div>
  )
}
