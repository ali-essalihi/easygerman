import Breadcrumb from '@/components/Breadcrumb'
import ToggleVideoCompletedButton from '@/components/ToggleVideoCompletedButton'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { fetchTopicDetail, fetchVideoDetail } from '@/fetchers'
import { ytVideoIdSchema } from '@easygerman/shared/schemas'
import { notFound } from 'next/navigation'

export default async function VideoPage({ params }: { params: { id: string } }) {
  const ytVideoIdParsed = ytVideoIdSchema.safeParse(params.id)

  if (!ytVideoIdParsed.success) {
    notFound()
  }

  const ytVideoId = ytVideoIdParsed.data
  const video = await fetchVideoDetail(ytVideoId)

  if (!video) {
    notFound()
  }

  const topic = await fetchTopicDetail(video.topicId)

  if (!topic) {
    notFound()
  }

  return (
    <>
      <Breadcrumb
        items={[
          { href: '/', label: 'Home' },
          { href: `/levels/${topic.levelId}`, label: topic.levelId },
          { href: `/topics/${topic.id}`, label: topic.title },
        ]}
      />
      <h1 className="text-2xl font-medium">{video.title}</h1>
      <div className="my-4">
        <ToggleVideoCompletedButton
          levelId={topic.levelId}
          topicId={topic.id}
          ytVideoId={video.ytVideoId}
        />
      </div>
      <YoutubeEmbed ytVideoId={video.ytVideoId} />
    </>
  )
}
