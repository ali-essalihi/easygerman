import { levelIdSchema } from '@easygerman/shared/schemas'
import { notFound } from 'next/navigation'
import LevelOverview from '../../_components/LevelOverview'
import TopicsManagement from '../../_components/TopicsManagement'
import Breadcrumb from '@/components/Breadcrumb'

export default async function AdminLevelPage({ params }: { params: { id: string } }) {
  const levelIdParsed = levelIdSchema.safeParse(params.id)

  if (!levelIdParsed.success) {
    notFound()
  }

  const levelId = levelIdParsed.data

  return (
    <>
      <Breadcrumb items={[{ href: '/admin', label: 'Admin' }]} />
      <LevelOverview levelId={levelId} />
      <TopicsManagement levelId={levelId} />
    </>
  )
}
