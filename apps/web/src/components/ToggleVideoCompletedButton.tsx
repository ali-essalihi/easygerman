'use client'

import type { LevelId } from '@easygerman/shared/types'
import useVideosProgress from '@/hooks/useVideosProgress'
import { LuSquare, LuCheck } from 'react-icons/lu'
import Button from './Button'

interface Props {
  levelId: LevelId
  topicId: string
  ytVideoId: string
}

export default function ToggleVideoCompletedButton({ levelId, topicId, ytVideoId }: Props) {
  const { isVideoCompleted, toggleVideoCompleted } = useVideosProgress(levelId, topicId)
  const completed = isVideoCompleted(ytVideoId)

  if (completed === null) {
    return null
  }

  const handleClick = () => toggleVideoCompleted(ytVideoId)

  if (completed) {
    return (
      <Button color="success" StartIcon={LuCheck} onClick={handleClick}>
        Completed
      </Button>
    )
  }

  return (
    <Button color="light" StartIcon={LuSquare} onClick={handleClick}>
      Mark as complete
    </Button>
  )
}
