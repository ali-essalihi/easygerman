import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import ToggleVideoCompletedButton from '@/components/ToggleVideoCompletedButton'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { fetchTopicDetail, fetchVideoDetail } from '@/fetchers'
import { ytVideoIdSchema } from '@easygerman/shared/schemas'
import { notFound } from 'next/navigation'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { data: ytVideoId, success } = ytVideoIdSchema.safeParse(params.id)
  if (!success) return {}
  const video = await fetchVideoDetail(ytVideoId)
  if (!video) return {}
  const topic = await fetchTopicDetail(video.topicId)
  if (!topic) return {}
  const title = video.title
  const image = `https://img.youtube.com/vi/${video.ytVideoId}/mqdefault.jpg`
  return {
    title,
    openGraph: {
      images: { url: image },
    },
    twitter: {
      images: { url: image },
    },
  }
}

export default async function VideoPage({ params }: { params: Params }) {
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
