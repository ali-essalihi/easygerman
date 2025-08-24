import type { GetAllVideosRes, LevelId } from '@easygerman/shared/types'
import CompletionStatus from './CompletionStatus'
import Link from 'next/link'
import { formatVideoDuration } from '@/utils/format'

interface Props {
  levelId: LevelId
  topicId: string
  video: GetAllVideosRes['videos'][number]
  order: number
}

export default function VideoListItem({ levelId, topicId, video, order }: Props) {
  return (
    <div className="py-2">
      <div className="flex items-center">
        <div className="bg-gray-200 w-1/3 h-20 sm:w-1/4 sm:h-24 relative">
          <img
            className="absolute size-full object-center object-cover"
            src={`https://img.youtube.com/vi/${video.ytVideoId}/mqdefault.jpg`}
            alt="Thumbnail"
            loading="lazy"
          />
          <span className="bg-black text-white text-xs px-0.5 py-px absolute right-0 bottom-0">
            {formatVideoDuration(video.durationSeconds)}
          </span>
        </div>
        <div className="flex-1 ml-2">
          <div className="text-primary mb-1"># {order}</div>
          <h2 className="text-sm mb-2 font-medium">
            <Link
              href={`/videos/${video.ytVideoId}`}
              prefetch={false}
              className="hover:text-primary"
            >
              {video.title}
            </Link>
          </h2>
          <CompletionStatus levelId={levelId} topicId={topicId} ytVideoId={video.ytVideoId} />
        </div>
      </div>
    </div>
  )
}
