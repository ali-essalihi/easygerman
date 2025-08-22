import Breadcrumb from '@/components/Breadcrumb'
import LabeledIcon from '@/components/LabeledIcon'
import TopicProgress from '@/components/TopicProgress'
import VideosList from '@/components/VideosList'
import { ClockIcon, VideoLibIcon } from '@/constants'
import { fetchTopicDetail, fetchVideosList } from '@/fetchers'
import { formatTotalDuration } from '@/utils/format'
import { topicIdSchema } from '@easygerman/shared/schemas'
import { notFound } from 'next/navigation'

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topicIdParsed = topicIdSchema.safeParse(params.id)

  if (!topicIdParsed.success) {
    notFound()
  }

  const topicId = topicIdParsed.data
  const topic = await fetchTopicDetail(topicId)

  if (!topic) {
    notFound()
  }

  const videosList = await fetchVideosList(topicId)

  return (
    <>
      <Breadcrumb
        items={[
          { href: '/', label: 'Home' },
          { href: `/levels/${topic.levelId}`, label: topic.levelId },
        ]}
      />
      <h1 className="text-2xl font-medium mb-2">{topic.title}</h1>
      <div className="flex items-center space-x-2 mb-2">
        <LabeledIcon Icon={VideoLibIcon} label={topic.totalVideos.toString()} />
        <LabeledIcon Icon={ClockIcon} label={formatTotalDuration(topic.totalSeconds)} />
      </div>
      <div className="mb-6">
        <TopicProgress levelId={topic.levelId} topicId={topic.id} totalVideos={topic.totalVideos} />
      </div>
      <VideosList levelId={topic.levelId} topicId={topic.id} videos={videosList.videos} />
    </>
  )
}
