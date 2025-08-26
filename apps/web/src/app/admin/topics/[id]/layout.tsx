import { topicIdSchema } from '@easygerman/shared/schemas'
import { notFound } from 'next/navigation'

export default function AdminTopicLayout({
  params,
  children,
}: {
  params: { id: string }
  children: React.ReactNode
}) {
  if (!topicIdSchema.safeParse(params.id).success) {
    notFound()
  }

  return children
}
