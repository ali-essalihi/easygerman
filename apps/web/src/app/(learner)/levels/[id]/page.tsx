import type { Metadata } from 'next'
import { levelIdSchema } from '@easygerman/shared/schemas'
import { fetchLevelSummary, fetchTopicsList } from '@/fetchers'
import { notFound } from 'next/navigation'
import LevelProgress from '@/components/LevelProgress'
import TopicsList from '@/components/TopicsList'
import LevelOverview from '@/components/LevelOverview'
import Breadcrumb from '@/components/Breadcrumb'

type Params = { id: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { data: levelId, success } = levelIdSchema.safeParse(params.id)
  if (!success) return {}
  const title = `Easy German - Level ${levelId}`
  return { title }
}

export default async function LevelPage({ params }: { params: Params }) {
  const levelIdParsed = levelIdSchema.safeParse(params.id)

  if (!levelIdParsed.success) {
    notFound()
  }

  const levelId = levelIdParsed.data

  const [levelSummary, topicsList] = await Promise.all([
    fetchLevelSummary(levelId),
    fetchTopicsList(levelId),
  ])

  return (
    <>
      <Breadcrumb items={[{ href: '/', label: 'Home' }]} />
      <LevelOverview levelId={levelId} summary={levelSummary} />
      <LevelProgress levelId={levelId} summary={levelSummary} />
      <hr className="my-6 md:my-12" />
      <h2 className="mb-4 text-2xl">Topics List</h2>
      <TopicsList levelId={levelId} topics={topicsList.topics} />
    </>
  )
}
