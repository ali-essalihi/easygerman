import type { GetAllVideosRes, LevelId } from '@easygerman/shared/types'
import VideoListItem from './VideoListItem'
import EmptyList from '../EmptyList'

interface Props {
  levelId: LevelId
  topicId: string
  videos: GetAllVideosRes['videos']
}

export default function VideosList({ levelId, topicId, videos }: Props) {
  if (videos.length === 0) {
    return <EmptyList>No videos added to this topic yet.</EmptyList>
  }

  return (
    <ul>
      {videos.map((video, index) => (
        <li key={video.ytVideoId} className="border-b first:border-t">
          <VideoListItem order={index + 1} levelId={levelId} topicId={topicId} video={video} />
        </li>
      ))}
    </ul>
  )
}
