'use client'

import type { LevelId } from '@easygerman/shared/types'
import useVideosProgress from '@/hooks/useVideosProgress'
import { LuCircleCheck } from 'react-icons/lu'
import { cx } from 'class-variance-authority'

interface Props {
  levelId: LevelId
  topicId: string
  ytVideoId: string
}

export default function CompletionStatus({ levelId, topicId, ytVideoId }: Props) {
  const { isVideoCompleted } = useVideosProgress(levelId, topicId)
  const completed = !!isVideoCompleted(ytVideoId)
  return (
    <div className={cx('flex items-center text-green-600', !completed && 'invisible')}>
      <LuCircleCheck size={16} className="me-2" />
      <span className="text-sm">Completed</span>
    </div>
  )
}
